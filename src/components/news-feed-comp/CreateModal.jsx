import React, { useState, useRef } from 'react';
import { Modal, Button, Form, Image, Spinner } from 'react-bootstrap';

import { GrStatusGood } from 'react-icons/gr';

const CreateModal = (props) => {
  const [show, setShow] = useState(false);
  const [text, setText] = useState(props.post?.text ?? '');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [picture, setPicture] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const areaRef = useRef();

  // pic upload
  const handleFileSelect = (e) => {
    const newFile = e.target.files[0];
    setFilePreview(URL.createObjectURL(e.target.files[0]));
    setPicture(newFile);
  };

  const uploadPic = async (postId) => {
    const formData = new FormData();
    formData.append('picture', picture, picture.name);
    const resp = await fetch(
      `${process.env.REACT_APP_API_URL}/api/posts/${postId}`,
      {
        method: 'POST',

        body: formData,
      }
    );
    console.log(resp);
    setPicture(null);
    setFilePreview(null);
  };

  const handleClose = () => {
    setShow(false);
    setText('');
    setSuccessMsg('');
    // props.getPosts();
    setPicture(null);
    setFilePreview(null);
  };
  const handleShow = () => {
    setShow(true);

    setTimeout(() => {
      areaRef.current.focus();
    }, 2);
  };

  const handleSubmit = async (e) => {
    console.log('ci speri');
    e.preventDefault();
    setSuccessMsg('');
    setLoading(true);
    if (props.method === 'POST') {
      const resp = await fetch(`${process.env.REACT_APP_API_URL}/posts/`, {
        method: 'POST',
        body: JSON.stringify({ text, profileId: props.userLogged.id }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await resp.json();

      if (picture) {
        await uploadPic(data.id);
      }

      // console.log(resp);
      setLoading(false);
      if (resp.ok) {
        setSuccessMsg('Congrats! Your post in on da line!');
        setText('');
        props.getPosts();
      }
    } else {
      const resp = await fetch(
        `${process.env.REACT_APP_API_URL}/api/posts/${props.post.id}`,
        {
          method: 'PUT',
          body: JSON.stringify({ text }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await resp.json();

      if (picture) {
        await uploadPic(data.id);
      }

      // console.log(resp);
      setLoading(false);
      if (resp.ok) {
        setSuccessMsg('Congrats! Your post in on da line!');
        setText('');
        props.getPosts();
      }
    }
  };

  return (
    <>
      <div className='w-100' onClick={handleShow}>
        {props.children}
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create a post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className='d-flex flex-column'>
            <div className='d-flex align-items-center mb-3'>
              <Image
                style={{ width: '70px', height: '70px' }}
                fluid
                roundedCircle
                src={props.userLogged?.image}
              />
              <h5 className='ml-3'>
                {props.userLogged?.name + ' ' + props.userLogged?.surname}
              </h5>
            </div>
            {!loading && successMsg.length === 0 && (
              <Form.Group>
                <Form.Control
                  as='textarea'
                  onChange={(e) => setText(e.target.value)}
                  name='text'
                  value={text}
                  placeholder='what do you want to talk about?'
                  rows={3}
                  ref={areaRef}
                />
              </Form.Group>
            )}

            {loading && (
              <div className='align-self-center'>
                <Spinner animation='grow' />
              </div>
            )}

            {successMsg.length > 0 && (
              <>
                <div
                  style={{ fontSize: '1.3rem' }}
                  className='d-flex align-items-center text-success mb-2 justify-content-center'
                >
                  <GrStatusGood />
                  <span className='ml-2'>{successMsg}</span>
                </div>
                <Button
                  onClick={handleClose}
                  variant='success'
                  className='align-self-end rounded-pill py-0'
                >
                  Go to Feed, Your Cat!
                </Button>
              </>
            )}

            {successMsg.length === 0 && (
              <Button
                onClick={handleSubmit}
                disabled={text.length === 0 ? true : false}
                variant='secondary'
                type='submit'
                className='align-self-end rounded-pill'
              >
                Post!
              </Button>
            )}
            <input type='file' onChange={handleFileSelect} className='mt-3' />
            <Image fluid src={filePreview} />
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CreateModal;
