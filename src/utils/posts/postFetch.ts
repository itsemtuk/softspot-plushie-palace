
import { validatePosts } from "../dataValidation";
import { ExtendedPost } from "@/types/core";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL) {
  console.error('VITE_SUPABASE_URL is not defined in .env or environment variables');
}

if (!SUPABASE_ANON_KEY) {
  console.error('VITE_SUPABASE_ANON_KEY is not defined in .env or environment variables');
}

const supabaseUrl = SUPABASE_URL;
const supabaseKey = SUPABASE_ANON_KEY;

export const fetchPosts = async (): Promise<ExtendedPost[]> => {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/posts?select=*`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return validatePosts(data);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

export const getAllPosts = async (): Promise<ExtendedPost[]> => {
  return fetchPosts();
};

export const getPosts = async (): Promise<ExtendedPost[]> => {
  return fetchPosts();
};
