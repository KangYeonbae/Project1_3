// Category.js
import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav, Modal, Button, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import plasticData from "./1_plasticData";
import disposableData from "./2_disposableData";
import wasteElecData from "./3_wasteElecData";
import foodWasteData from "./4_foodWasteData";
import wasteData from "./5_wasteData";
import home from "./totalData";
import "../css/App_border.css"

function Category({ category }) {
    const [data, setData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleOpenModal = (item) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setSelectedItem(null);
        setShowModal(false);
    };

    useEffect(() => {
        switch (category) {
            case 'plastic':
                setData(plasticData);
                break;
            case 'disposable':
                setData(disposableData);
                break;
            case 'wasteElec':
                setData(wasteElecData);
                break;
            case 'foodWaste':
                setData(foodWasteData);
                break;
            case 'waste':
                setData(wasteData);
                break;
            default:
                setData(home);
                break;
        }
    }, [category]);

    return (
        <div className="container_border">
            <div className="header_box"></div>
            {/*<Navbar bg="light" data-bs-theme="light">*/}
            {/*    <Container>*/}
            {/*        <Navbar.Brand href="/">자원순환 방법</Navbar.Brand>*/}
            {/*        <Nav className="me-auto">*/}
            {/*            <Nav.Link as={Link} to="/board/plastic">분리배출</Nav.Link>*/}
            {/*            <Nav.Link as={Link} to="/board/disposable">일회용품</Nav.Link>*/}
            {/*            <Nav.Link as={Link} to="/board/wasteElec">폐가전</Nav.Link>*/}
            {/*            <Nav.Link as={Link} to="/board/foodWaste">음식물 폐기물</Nav.Link>*/}
            {/*            <Nav.Link as={Link} to="/board/waste">기타폐기물</Nav.Link>*/}
            {/*        </Nav>*/}
            {/*    </Container>*/}
            {/*</Navbar>*/}
            <div className="row">
                {data.map((item, index) => (
                    <Card key={index} item={item} onOpenModal={handleOpenModal} />
                ))}
            </div>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedItem && selectedItem.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Carousel>
                        {selectedItem && selectedItem.images.map((image, index) => (
                            <Carousel.Item key={index}>
                                <img
                                    className="d-block w-100"
                                    src={process.env.PUBLIC_URL + '/' + image}
                                    alt={`${selectedItem.title} ${index + 1}`}
                                />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

function Card({ item, onOpenModal }) {
    return (
        <div className="col-md-4 data_border">
            <Button onClick={() => onOpenModal(item)} variant="link">
                <img src={process.env.PUBLIC_URL + '/' + item.image} alt={item.title} />
            </Button>
            <h5>{item.title}</h5>
            <p>{item.description}</p>
        </div>
    );
}

export default Category;
