import React, { useEffect, useState } from 'react';
import { IoClose } from "react-icons/io5";
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

function ZeroCenters(props) {
    /* global kakao */

    const [address, setAddress] = useState('');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        if (props.selectZeroshop) {
            const geocoder = new kakao.maps.services.Geocoder();

            const coord = new kakao.maps.LatLng(props.selectZeroshop.LATITUDE, props.selectZeroshop.LONGITUDE);
            geocoder.coord2Address(coord.getLng(), coord.getLat(), function(result, status) {
                if (status === kakao.maps.services.Status.OK) {
                    console.log(result[0].address.address_name);
                    setAddress(result[0].address.address_name);
                }
            });
        }
    }, [props.selectZeroshop]);

    useEffect(() => {
        const fetchImages = async () => {
            setLoading(true); // Set loading to true before fetching
            try {
                const response = await axios.get('http://localhost:3001/zeroimg'); // 서버 URL을 입력하세요
                setImages(response.data);
            } catch (error) {
                console.error('Error fetching images', error);
            } finally {
                setLoading(false); // Set loading to false after fetching is done
            }
        };

        fetchImages();
    }, []);

    // 선택된 샵에 해당하는 이미지 필터링
    const filteredImages = images.filter(image => image.id === props.selectZeroshop.ID);

    return (
        <div className="sidebar2">
            <div className="sidebar2_border">
                <div className="Rec">
                    <button>
                        <IoClose style={{color: 'black'}} onClick={props.closeZeroshop}/>
                    </button>
                </div>
                <div>
                    {props.selectZeroshop ? (
                        <div className="details">
                            <h4>제로웨이스트샵</h4>
                            <h1>{props.selectZeroshop.NAME.split('_')[1]}</h1><br/>
                            <h4>주소</h4>
                            <p>지번: {address}<br/></p>
                        </div>
                    ) : (
                        <p>No marker data available</p>
                    )}
                    <div>
                        {loading ? ( // Check if it's loading
                            <p>Loading images...</p>
                        ) : (
                            filteredImages.length > 0 ? (
                                <Swiper
                                    modules={[Navigation, Pagination, A11y]}
                                    navigation
                                    pagination={{clickable: true}}
                                    spaceBetween={10}
                                    slidesPerView={1}
                                    className="mySwiper"
                                    style={{width:"100%"}}
                                >
                                    {filteredImages.map((image) => (
                                        <>
                                            {Array.from({length: 8}).map((_, index) => {
                                                const imgProp = `img${index + 1}`;
                                                return image[imgProp] && (
                                                    <SwiperSlide key={`${image.id}-${index + 1}`}>
                                                        <img src={`data:image/jpeg;base64,${image[imgProp]}`}
                                                             alt={`Image ${image.id} - ${index + 1}`}
                                                             style={{width: '100%', height: 'auto', maxHeight: "250px"}}/>
                                                    </SwiperSlide>
                                                );
                                            })}
                                        </>
                                    ))}
                                </Swiper>
                            ) : (
                                <p>No images available</p>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ZeroCenters;
