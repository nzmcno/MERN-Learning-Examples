import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { tiktokRepository } from '../repositories/tiktok.repository';

export const tiktokRoute = new Hono()
  // GET all videos
  .get('/videos', async (c) => {
    const videos = await tiktokRepository.getAll();
    return c.json({ success: true, data: videos });
  })

  // POST create video
  .post(
    '/videos',
    zValidator(
      'json',
      z.object({
        authorName: z.string().min(2),
        caption: z.string().min(3),
        songTitle: z.string().min(2),
        videoUrl: z.string().url(),
      })
    ),
    async (c) => {
      const body = c.req.valid('json');
      const video = await tiktokRepository.createVideo(body);
      return c.json({ success: true, data: video }, 201);
    }
  )

  // POST toggle like
  .post('/videos/:id/like', async (c) => {
    const id = c.req.param('id');
    const updated = await tiktokRepository.toggleLike(id);
    if (!updated) {
      return c.json({ success: false, error: 'Video not found' }, 404);
    }
    return c.json({ success: true, data: updated });
  })

  // GET comments for video
  .get('/videos/:id/comments', async (c) => {
    const id = c.req.param('id');
    const comments = await tiktokRepository.getComments(id);
    return c.json({ success: true, data: comments });
  })

  // POST comment to video
  .post(
    '/videos/:id/comments',
    zValidator(
      'json',
      z.object({
        authorName: z.string().optional().default('Anonymous Dev'),
        text: z.string().min(1, 'Comment text cannot be empty'),
      })
    ),
    async (c) => {
      const id = c.req.param('id');
      const body = c.req.valid('json');
      const comment = await tiktokRepository.addComment(id, body.authorName, body.text);
      return c.json({ success: true, data: comment }, 201);
    }
  );
