import React from 'react';
import axios from 'axios';
import { Button } from '@mui/material';

function DeletePost({ postId, onDelete }) {
    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:3001/posts/${postId}`, {
                withCredentials: true
            });
            if (response.status === 200) {
                alert('게시글이 성공적으로 삭제되었습니다.');
                onDelete();
            }
        } catch (error) {
            console.error('Failed to delete post:', error);
            alert('게시글 삭제에 실패했습니다.');
        }
    };

    return (
        <Button variant="contained" color="secondary" onClick={handleDelete}>
            삭제
        </Button>
    );
}

export default DeletePost;
