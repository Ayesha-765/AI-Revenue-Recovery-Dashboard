-- Create profiles table for Supabase Auth
-- Run this in your Supabase SQL Editor

create table if not exists public.profiles (
  auth_id uuid not null primary key references auth.users(id) on delete cascade,
  full_name text not null,
  business_name text not null,
  email text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Allow public read access
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

-- Allow authenticated users to insert their own profile
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = auth_id);

-- Allow authenticated users to update their own profile
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = auth_id);
