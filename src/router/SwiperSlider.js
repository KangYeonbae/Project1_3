import React, {useRef, useState} from 'react';
// Import Swiper React components
import {Swiper, SwiperSlide} from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import '../css/style.css';

import {Pagination} from 'swiper/modules';

export default () => {
    return (
        <>
            <Swiper
                slidesPerView={4}
                centeredSlides={true}
                spaceBetween={50}
                grabCursor={true}
                pagination={{
                    clickable: true,
                }}
                // modules={[Pagination]}
                className="mySwiper"
            >
                <SwiperSlide>
                    <div className="slide-img1"></div>
                    <div className="slide-txt">
                        <h6>그림으로 만나는 분리수거</h6>
                        <h2>분리수거를 </h2><h2>쉽게!</h2>
                        <p>그림으로 쉽게 분리수거방법을 볼수있습니다. 누구나 쉽게 따라할수 분리수거입니다.</p>
                        <div className="map-btn">
                            <span>바로가기</span>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="slide-img2"></div>
                    <div className="slide-txt">
                        <h6>내 위치기반 정보제공 서비스</h6>
                        <h2>집 근처 환경관련 서비스를 한눈에</h2>
                        <p>현재 당신의 위치를 기반으로 각종 편의시설의 위치부터 최단거리 길찾기 서비스를 제공합니다.</p>
                        <div className="map-btn">
                        <span>바로가기</span>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="slide-img"></div>
                    <div className="slide-txt">
                        <h6>내 위치기반 정보제공 서비스</h6>
                        <h2>집 근처 환경관련 서비스를 한눈에</h2>
                        <p>현재 당신의 위치를 기반으로 각종 편의시설의 위치부터 최단거리 길찾기 서비스를 제공합니다.</p>
                        <div className="map-btn">
                        <span>바로가기</span>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="slide-img"></div>
                    <div className="slide-txt">
                        <h6>내 위치기반 정보제공 서비스</h6>
                        <h2>집 근처 환경관련 서비스를 한눈에</h2>
                        <p>현재 당신의 위치를 기반으로 각종 편의시설의 위치부터 최단거리 길찾기 서비스를 제공합니다.</p>
                        <div className="map-btn">
                        <span>바로가기</span>
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>
        </>
    );
};