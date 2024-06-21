import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import DeletePost from './Delete';
import {Container, Typography, Button, Box} from '@mui/material';
import {AuthContext} from "./AuthContext";
import '../css/DetailPost.css';
import { FaTrashAlt, FaPencilAlt } from "react-icons/fa";


function DetailPost({postId}) {
    const {user} = useContext(AuthContext);
    const [post, setPost] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token')
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/posts/${postId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setPost(response.data);
            } catch (error) {
                console.error('Failed to fetch post:', error);
                setError(error);
            }
        };

        fetchPost();
    }, [postId]);

    if (error) {
        return <div>Failed to fetch post: {error.message}</div>;
    }

    if (!post) {
        return <div>Loading...</div>;
    }

    const imageUrl = post.IMAGE_PATH ? `http://localhost:3001${post.IMAGE_PATH}` : null;

    const handleEdit = () => {
        navigate(`/edit/${post.ID}`);
    };

    return (
        <>
            {/*<div className="header_box"></div>*/}
            <Container className="detail-post-container">
                <div className="detail-head">
                    <h5 className="detail-post-title">{post.TITLE}</h5>
                    <div className="detail-posts">
                        {imageUrl && <img src={imageUrl} alt="Post" className="detail-post-image"/>}
                        {user && user.id === post.AUTHOR_ID && (
                            <Box mt={2} className="detail-post-buttons">
                                <FaPencilAlt>
                                    <button
                                        onClick={handleEdit}
                                        style={{marginRight: '10px'}}
                                    >
                                        수정
                                    </button>
                                </FaPencilAlt>
                                <FaTrashAlt>
                                    <DeletePost postId={post.ID} onDelete={() => navigate('/posts')}/>
                                </FaTrashAlt>
                            </Box>
                        )}
                    </div>
                </div>
                <div className="detail-post-content">
                    {post.CONTENT}
                </div>

            </Container>
        </>
    );
}

export default DetailPost;
