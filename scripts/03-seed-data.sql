-- Insert some sample data for testing (optional)
-- This will only work after you've created at least one user account

-- Note: You can run this after creating your first user account
-- The user IDs will need to be replaced with actual user IDs from your auth.users table

-- Example of how to insert sample posts (uncomment and modify after creating users):
INSERT INTO public.posts (title, content, author_id) VALUES
  ('Welcome to InkDrop!', 'This is the first post on our new blog platform. We''re excited to share our thoughts and connect with the community! InkDrop is designed to be a modern, minimalist space for your ideas.', 'ccd0c0a4-bde4-4cc0-afc6-105ddd798497'),
  ('Getting Started with Blogging', 'Here are some tips for writing great blog posts that engage your audience and keep them coming back for more. Focus on clear, concise language and compelling narratives.', 'ccd0c0a4-bde4-4cc0-afc6-105ddd798497'),
  ('The Future of Web Development', 'Exploring the latest trends and technologies shaping the web. From AI-powered tools to new frameworks, the landscape is constantly evolving.', 'ccd0c0a4-bde4-4cc0-afc6-105ddd798497'),
  ('Minimalist Design Principles', 'Less is more. Discover how minimalist design can enhance user experience and create beautiful, functional interfaces.', 'ccd0c0a4-bde4-4cc0-afc6-105ddd798497'),
  ('AI in Everyday Life: A Beginner''s Guide', 'Artificial Intelligence is no longer just a sci-fi concept. Learn how AI is integrated into your daily routines, from smart assistants to personalized recommendations. Understand the basics of machine learning and neural networks.', 'ccd0c0a4-bde4-4cc0-afc6-105ddd798497'),
  ('Exploring the Wonders of Southeast Asia', 'Embark on a virtual journey through the vibrant cultures, stunning landscapes, and delicious cuisines of Southeast Asia. Discover hidden gems and popular destinations like Thailand, Vietnam, and Indonesia.', 'ccd0c0a4-bde4-4cc0-afc6-105ddd798497'),
  ('The Ethics of AI: Navigating the Future', 'As AI technology advances, so do the ethical dilemmas it presents. This post delves into important discussions around AI bias, privacy, and the impact on employment. What responsibilities do developers and users have?', 'ccd0c0a4-bde4-4cc0-afc6-105ddd798497'),
  ('Budget Travel Tips: See the World for Less', 'Dreaming of travel but worried about the cost? This guide provides practical tips for budget-friendly adventures, including finding cheap flights, affordable accommodation, and saving on food and activities.', 'ccd0c0a4-bde4-4cc0-afc6-105ddd798497'),
  ('Understanding Large Language Models (LLMs)', 'Dive into the world of LLMs like GPT-4o and their applications. Learn how these powerful AI models are trained, what they can do, and their limitations. Explore their potential in content creation, coding, and more.', 'ccd0c0a4-bde4-4cc0-afc6-105ddd798497'),
  ('Solo Travel: A Journey of Self-Discovery', 'Considering a solo trip? This post shares insights and advice for first-time solo travelers, covering safety tips, planning, and how to embrace the freedom and growth that comes with exploring alone.', 'ccd0c0a4-bde4-4cc0-afc6-105ddd798497');
