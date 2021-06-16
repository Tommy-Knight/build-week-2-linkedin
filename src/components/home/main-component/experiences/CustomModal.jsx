import React, { useState } from 'react';
import { Modal, Button, Spinner, Image } from 'react-bootstrap';

import { format, parseISO } from 'date-fns';
// & add validation for startDate
const CustomModal = ({
  children,
  fetchExperiences,
  profileId,
  method,
  expID,
  area,
  company,
  role,
  description,
  startDate,
  endDate,
  image,
  user,
}) => {
  const initialFields = {
    area: area ?? '',
    company: company ?? '',
    role: role ?? '',
    description: description ?? '',
    startDate: (startDate && format(parseISO(startDate), 'yyyy-MM-dd')) || '',
    endDate: (endDate && format(parseISO(endDate), 'yyyy-MM-dd')) || '',
  };
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(initialFields);
  const [expPic, setExpPic] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  // file upload
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFilePreview(URL.createObjectURL(e.target.files[0]));

    setExpPic(selectedFile);
    // console.log(expPic);
  };

  const uploadPic = async (profileId, experienceID) => {
    const formData = new FormData();
    formData.append('picture', expPic, expPic.name);
    const resp = await fetch(
      `${process.env.REACT_APP_API_URL}/api/profile/${profileId}/experiences/${experienceID}/picture`,
      {
        method: 'POST',
        body: formData,
      }
    );
    console.log(resp);
  };

  const postExperience = async (newExp) => {
    setLoading(true);
    const resp = await fetch(
      `${process.env.REACT_APP_API_URL}/api/profile/${user.id}/experiences`,
      {
        method: 'POST',
        body: JSON.stringify(newExp),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const body = await resp.json();
    console.log(body);
    setLoading(false);
    setFields(initialFields);
    console.log(body);
    // aspetto che finisca di caricare e poi fetcho
    if (expPic) {
      await uploadPic(body.profileId, body.id);
      fetchExperiences(user.id);
      setExpPic(null);
    } else {
      fetchExperiences(user.id);
    }
  };

  const editExperience = async (exp) => {
    setLoading(true);
    const resp = await fetch(
      `${process.env.REACT_APP_API_URL}/api/profile/${profileId}/experiences/${expID}`,
      {
        method: 'PUT',
        body: JSON.stringify(exp),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const body = await resp.json();
    setLoading(false);
    console.log(body);

    if (expPic) {
      await uploadPic(body.profileId, body.id);
      fetchExperiences(body.profileId);
      setExpPic(null);
    } else {
      fetchExperiences(body.profileId);
    }
  };

  const handleSubmit = () => {
    if (method === 'POST') {
      postExperience(fields);
    }
    if (method === 'PUT') {
      editExperience(fields);
    }
    handleClose();
  };

  const handleClose = () => {
    setShow(false);
    setExpPic(null);
  };
  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    const value = e.target.value;
    setFields({ ...fields, [e.target.name]: value });
  };

  return (
    <>
      <div className='d-inline-block' onClick={handleShow}>
        {children}
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop='static'
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading && <Spinner animation='grow' />}
          {!loading && (
            <>
              {' '}
              <label> company</label>
              <input
                className='d-block'
                onChange={handleChange}
                name='company'
                value={fields.company}
              />{' '}
              <label>role </label>
              <input
                className='d-block'
                onChange={handleChange}
                name='role'
                value={fields.role}
              />
              <label>Area</label>
              <input
                className='d-block'
                onChange={handleChange}
                name='area'
                value={fields.area}
              />
              <label>description </label>
              <input
                className='d-block'
                onChange={handleChange}
                name='description'
                value={fields.description}
              />
              <label>startDate </label>
              <input
                required
                className='d-block'
                onChange={handleChange}
                name='startDate'
                value={fields.startDate}
                type='date'
              />
              <label>endDate </label>
              <input
                className='d-block'
                onChange={handleChange}
                name='endDate'
                value={fields.endDate}
                type='date'
              />
              <input type='file' onChange={handleFileChange} className='my-3' />
              <Image fluid src={filePreview} />
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Close
          </Button>
          <Button variant='primary' onClick={handleSubmit}>
            go!
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default CustomModal;
