-- Famille Tameghe Database Schema
-- Execute this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Family Members Table
CREATE TABLE IF NOT EXISTS family_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prenom TEXT NOT NULL,
  nom TEXT NOT NULL,
  surnom TEXT,
  genre TEXT NOT NULL CHECK (genre IN ('homme', 'femme')),
  date_naissance DATE,
  date_deces DATE,
  cadre_couleur TEXT,
  generation_index INTEGER,
  is_family_head BOOLEAN DEFAULT FALSE,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Family Relationships Table (parent-child)
CREATE TABLE IF NOT EXISTS family_relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
  type_relation TEXT NOT NULL CHECK (type_relation IN ('biologique', 'adoption', 'alliance')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(parent_id, child_id)
);

-- Family Unions Table (marriages, partnerships)
CREATE TABLE IF NOT EXISTS family_unions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partenaire_a_id UUID NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
  partenaire_b_id UUID NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
  type_relation TEXT NOT NULL CHECK (type_relation IN ('mariage', 'divorce', 'union_libre')),
  date_debut DATE,
  date_fin DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(partenaire_a_id, partenaire_b_id)
);

-- Admin Users Table (for authentication)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_family_members_generation ON family_members(generation_index);
CREATE INDEX IF NOT EXISTS idx_family_members_family_head ON family_members(is_family_head);
CREATE INDEX IF NOT EXISTS idx_relationships_parent ON family_relationships(parent_id);
CREATE INDEX IF NOT EXISTS idx_relationships_child ON family_relationships(child_id);
CREATE INDEX IF NOT EXISTS idx_unions_partenaire_a ON family_unions(partenaire_a_id);
CREATE INDEX IF NOT EXISTS idx_unions_partenaire_b ON family_unions(partenaire_b_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to tables
CREATE TRIGGER update_family_members_updated_at
  BEFORE UPDATE ON family_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_family_unions_updated_at
  BEFORE UPDATE ON family_unions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_unions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public read access for family data
CREATE POLICY "Public read access for family_members"
  ON family_members FOR SELECT
  USING (true);

CREATE POLICY "Public read access for family_relationships"
  ON family_relationships FOR SELECT
  USING (true);

CREATE POLICY "Public read access for family_unions"
  ON family_unions FOR SELECT
  USING (true);

-- Admin-only write access (authenticated users with admin role)
CREATE POLICY "Admin write access for family_members"
  ON family_members FOR ALL
  USING (
    auth.uid() IN (SELECT id FROM admin_users WHERE email = auth.jwt()->>'email')
  );

CREATE POLICY "Admin write access for family_relationships"
  ON family_relationships FOR ALL
  USING (
    auth.uid() IN (SELECT id FROM admin_users WHERE email = auth.jwt()->>'email')
  );

CREATE POLICY "Admin write access for family_unions"
  ON family_unions FOR ALL
  USING (
    auth.uid() IN (SELECT id FROM admin_users WHERE email = auth.jwt()->>'email')
  );

-- Admin users can read their own data
CREATE POLICY "Admin users can read own data"
  ON admin_users FOR SELECT
  USING (auth.uid() = id);
