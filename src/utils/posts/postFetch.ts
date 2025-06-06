
import { validatePosts } from "../dataValidation";
import { ExtendedPost } from "@/types/core";

// Use the hardcoded Supabase credentials (same as in client.ts)
const supabaseUrl = "https://evsamjzmqzbynwkuszsm.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2c2FtanptcXpieW53a3VzenNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MzgwMTEsImV4cCI6MjA2MDQxNDAxMX0.rkYcUyq7tMf3om2doHkWt85bdAHinEceuH43Hwn1knw";

export const fetchPosts = async (): Promise<ExtendedPost[]> => {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/posts?select=*`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn(`HTTP error! status: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return validatePosts(data);
  } catch (error) {
    console.warn("Error fetching posts, returning empty array:", error);
    return [];
  }
};

export const getAllPosts = async (): Promise<ExtendedPost[]> => {
  return fetchPosts();
};

export const getPosts = async (): Promise<ExtendedPost[]> => {
  return fetchPosts();
};
