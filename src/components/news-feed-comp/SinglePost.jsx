import React, { Component } from 'react';
import { Col, Card, Image } from 'react-bootstrap';

// import EditModal from './EditModal';

// react icons
import { BsFillTrashFill } from 'react-icons/bs';
import { AiTwotoneEdit } from 'react-icons/ai';
import { AiOutlineLike } from 'react-icons/ai';
import { BiMessageRoundedDetail } from 'react-icons/bi';
import { BsArrow90DegRight } from 'react-icons/bs';
import { RiSendPlaneFill } from 'react-icons/ri';

// packages
import styled from 'styled-components';
import { format, parseISO } from 'date-fns';

import CreateModal from './CreateModal';
import CommentList from './CommentList';
//

const iconStyles = {
  marginRight: '5px',
  fontSize: '25px',
};

export default class SinglePost extends Component {
  state = {
    editMode: false,
    text: this.props.post.text,
  };

  handleDeletePost = async () => {
    if (this.props.userLogged.id === this.props.post.profile.id) {
      // this.setState({ isLoading: true });
      const resp = await fetch(
        `${process.env.REACT_APP_API_URL}/api/posts/${this.props.post.id}`,
        {
          method: 'DELETE',
        }
      );
      // console.log(resp);
      // this.setState({ isLoading: false });
      if (!resp.ok) {
        // console.log(resp);
      }
      this.props.getPosts();
    } else {
      alert('non puoi toccare i post degli altri 💩');
    }
  };

  handleEdit = () => {
    if (this.props.userLogged.id === this.props.post.profile.id) {
      this.setState({ editMode: !this.state.editMode });
    } else {
      alert('non puoi toccare i post degli altri 💩');
    }
  };

  handleChange = (e) => {
    this.setState({ text: e.target.value });
  };

  handleSave = async () => {
    //&&implement ask if wanna delete
    // if (this.state.text.length === 0) {
    // }

    const text = this.state.text;
    console.log('puttttinnnnn');
    const resp = await fetch(
      `${process.env.REACT_APP_API_URL}/api/posts/${this.props.post.id}`,
      {
        method: 'PUT',
        body: JSON.stringify({ text }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (!resp.ok) {
      // console.log(resp);
    }

    this.setState({ editMode: false });
  };

  render() {
    // console.log(this.props.userLogged);
    console.log(this.props.post);

    return (
      <Col xs={12} className='mt-3 px-0'>
        <Card className='border rounded pt-3 px-4 bg-white'>
          <div className='mb-3 d-flex align-items-center'>
            <Image
              alt='hi'
              style={{ width: '70px', height: '70px' }}
              roundedCircle
              src={this.props.post.profile.image}
            />{' '}
            <span className='font-weight-bold ml-3'>
              {' '}
              by{' '}
              {this.props.post.profile.name +
                ' ' +
                this.props.post.profile.surname}
            </span>
            {this.props.userLogged?.id === this.props.post.profile.id && (
              <div className='d-flex align-items-center  ml-auto'>
                <div>
                  <BsFillTrashFill
                    onClick={this.handleDeletePost}
                    style={{ cursor: 'pointer', fontSize: '1.3rem' }}
                    className='mr-3'
                  />
                </div>
                <CreateModal
                  getPosts={this.props.getPosts}
                  method='PUT'
                  userLogged={this.props.userLogged}
                  post={this.props.post}
                >
                  <AiTwotoneEdit
                    style={{ cursor: 'pointer', fontSize: '1.5rem' }}
                    onClick={this.handleEdit}
                  />
                </CreateModal>
              </div>
            )}
          </div>
          <p>{`created at ${format(
            parseISO(this.props.post.createdAt),
            'yyyy-MMM-dd | HH:mm'
          )}`}</p>
          <textarea
            style={{
              color: 'black',
              resize: 'none',
              outline: 'none',
              border: 'none',
              background: 'unset',
              minHeight: '5vh',
              maxHeight: '15vh',
            }}
            disabled
            value={this.state.text}
          />
          {this.props.post?.image && (
            <Image
              style={{
                // width: '100%',
                maxHeight: '30vh',
                objectFit: 'contain',
              }}
              src={this.props.post.image}
            />
          )}
          <div className='d-flex mt-2'>
            <SButton variant='outline-dark'>
              <AiOutlineLike style={iconStyles} />
              Like
            </SButton>
            <SButton variant='outline-dark'>
              <BiMessageRoundedDetail style={iconStyles} />
              Comment
            </SButton>
            <SButton variant='outline-dark'>
              <BsArrow90DegRight style={iconStyles} />
              Share
            </SButton>
            <SButton variant='outline-dark'>
              <RiSendPlaneFill style={iconStyles} />
              Send
            </SButton>
          </div>

          <CommentList
            userLogged={this.props.userLogged}
            postId={this.props.post.id}
          />
        </Card>
      </Col>
    );
  }
}

const SButton = styled.button`
  border: none !important;
  border-radius: 8%;
  background-color: white;
  color: #5e5d5d;
  padding-left: 2%;
  padding-right: 2%;
  padding-top: 3%;
  padding-bottom: 3%;
  font-size: 15px;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  &:focus {
    outline: 1px solid #fff;
    outline-offset: -4px;
  }
  &:hover {
    background-color: rgba(235, 235, 235, 1);
  }

  &:active {
    transform: scale(0.95);
  }
`;
