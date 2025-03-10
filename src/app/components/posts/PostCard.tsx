'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useContext, useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { AiOutlineLike, AiFillLike } from 'react-icons/ai';
import { VscComment } from 'react-icons/vsc';
import { GoKebabHorizontal } from 'react-icons/go';
import { RiSendPlaneFill } from 'react-icons/ri';

import { UserContext } from '@/app/providers/UserProvider';
import { Post } from '@/app/types';

import Avatar from '../common/Avatar';
import PostMenu from '../menus/PostMenu';
import PostComments from './PostComments';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const [viewComment, setViewComment] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const toggleInput = () => {
    setViewComment(!viewComment);

    if (viewComment !== false) {
      return;
    }

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handlePostMenu = () => {
    setIsOpen(!isOpen);
  };

  const [comment, setComment] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const submitComment = async (
    e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    const { key } = e as React.KeyboardEvent<HTMLInputElement>;
    if (key && key !== 'Enter') return;
    if (loading) return;
    setLoading(true);
    const data = {
      postId: post.id,
      content: comment,
    };
    await axios
      .post('/api/comment', data)
      .then(() => {
        toast.success('Comment posted');
        router.refresh();
      })
      .catch(() => {
        toast.error('Error posting comment');
      })
      .finally(() => {
        setLoading(false);
        setComment('');
      });
  };

  const likePost = async () => {
    if (loading) return;
    setLoading(true);
    const data = {
      postId: post.id,
    };

    await axios
      .post('/api/like', data)
      .then((res) => {
        const response = res.data.status;

        if (response === 201) {
          toast.success('Post liked');
        } else if (response === 204) {
          toast.success('Post unliked');
        }

        router.refresh();
      })
      .catch(() => {
        toast.error('Error liking post');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div
      className="flex flex-col p-4 bg-white dark:bg-[#242526]
      border dark:border-0 border-neutral-300 dark:border-[#e4e6eb]
      rounded-md shadow-sm "
    >
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <Avatar user={post.author} size={40} button />
          <div className="flex flex-col">
            <Link
              href={`/user/${post.author.id}`}
              className="text-lg text-black dark:text-[#e4e6eb] hover:underline"
            >
              {post.author.name}
            </Link>
            <div className="text-sm font-light text-neutral-500 dark:text-neutral-400">
              {post.createdAt}
            </div>
          </div>

          {post.author.id === user.id && (
            <div className="relative ml-auto">
              <button
                onClick={handlePostMenu}
                className="p-1 duration-300 rounded-full
                text-neutral-500 dark:text-neutral-400
                hover:bg-neutral-100 dark:hover:bg-[#3a3b3c]"
              >
                <GoKebabHorizontal size={20} />
              </button>

              <PostMenu isOpen={isOpen} setIsOpen={setIsOpen} postId={post.id} />
            </div>
          )}
        </div>

        <div className="py-2 text-lg sm:text-2xl text-black dark:text-[#e4e6eb]">
          {post.content}
        </div>

        {post.postImage && (
          <div className="relative w-full mb-2 overflow-hidden rounded-md aspect-square">
            <Image
              alt="post image"
              src={post.postImage}
              fill
              className="object-cover duration-300 hover:scale-110"
            />
          </div>
        )}

        <div className="flex text-neutral-500 dark:text-neutral-400">
          {post.likes.length > 0 && (
            <div className="flex items-center gap-1 pb-1 mr-auto">
              <AiOutlineLike size={12} />

              <div className="text-sm">{post.likes.length}</div>
            </div>
          )}

          {post.comments.length > 0 && (
            <div className="flex items-center gap-1 pb-1 ml-auto">
              <div className="text-sm">{post.comments.length}</div>
              <VscComment size={12} />
            </div>
          )}
        </div>

        <hr className="dark:border-[#393a3b]" />

        <div className="flex justify-around text-xl text-neutral-500 dark:text-neutral-400">
          <button
            onClick={likePost}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2
            rounded-md duration-300
            hover:bg-neutral-100 dark:hover:bg-[#3a3b3c]
            focus:outline-none focus:bg-neutral-100"
          >
            {post.likes.some((like) => like.author.id === user.id) ? (
              <>
                <AiFillLike size={20} />
                <div>Liked</div>
              </>
            ) : (
              <>
                <AiOutlineLike size={20} />
                <div>Like</div>
              </>
            )}
          </button>
          <button
            onClick={toggleInput}
            className="flex items-center gap-2 px-4 py-2
            rounded-md duration-300
            hover:bg-neutral-100 dark:hover:bg-[#3a3b3c]
            focus:outline-none focus:bg-neutral-100"
          >
            <VscComment size={20} />
            <div>Comment</div>
          </button>
        </div>

        <hr className="dark:border-[#393a3b]" />

        <div className="flex flex-col">
          <PostComments comments={post.comments} />

          <div
            className={`
              flex items-center gap-2 overflow-hidden duration-1000
              ${viewComment ? 'max-h-96 mt-3 py-1' : 'max-h-0'}
            `}
          >
            {viewComment && (
              <>
                <Avatar user={user} size={36} button />
                <input
                  onKeyDown={(e) => {
                    submitComment(e);
                  }}
                  onChange={(e) => {
                    setComment(e.target.value);
                  }}
                  value={comment}
                  ref={inputRef}
                  maxLength={255}
                  className="flex-1 px-4 py-2 rounded-full
                  bg-neutral-100 dark:bg-[#3a3b3c]
                  text-neutral-500 dark:text-neutral-400
                  placeholder:font-light
                  placeholder:text-neutral-500 dark:placeholder:text-neutral-400
                  duration-300 hover:bg-neutral-200 dark:hover:bg-[#4e4f50] 
                  focus:outline-none focus:border 
                  focus:border-neutral-300 dark:focus:border-neutral-400"
                  placeholder="Write a comment..."
                />
                <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => submitComment(e)}>
                  <RiSendPlaneFill size={30} className="text-neutral-500 dark:text-neutral-400" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
