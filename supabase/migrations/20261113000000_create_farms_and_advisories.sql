-- ==============================================================================
-- AgriAssist AI - Supabase PostgreSQL Initial Migration
-- Creates farms and advisories tables with indexes, triggers, and RLS policies
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Trigger function to auto-update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Farms Table
CREATE TABLE IF NOT EXISTS public.farms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) NOT NULL,
    farm_name VARCHAR(150) NOT NULL,
    location_region VARCHAR(150) NOT NULL,
    soil_type VARCHAR(50) NOT NULL,
    soil_ph NUMERIC(3,1) CHECK (soil_ph >= 3.5 AND soil_ph <= 10.0),
    total_area_acres NUMERIC(8,2) CHECK (total_area_acres > 0),
    irrigation_type VARCHAR(50),
    primary_crops TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Advisories Table
CREATE TABLE IF NOT EXISTS public.advisories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID REFERENCES public.farms(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    crop_name VARCHAR(100) NOT NULL,
    symptom_description TEXT NOT NULL,
    image_url TEXT,
    diagnosis_title VARCHAR(255) NOT NULL,
    confidence_score INTEGER CHECK (confidence_score BETWEEN 0 AND 100),
    severity_level VARCHAR(50) NOT NULL,
    issue_category VARCHAR(100) NOT NULL,
    organic_remedies JSONB NOT NULL DEFAULT '[]'::jsonb,
    chemical_treatments JSONB NOT NULL DEFAULT '[]'::jsonb,
    preventative_measures JSONB NOT NULL DEFAULT '[]'::jsonb,
    fertilizer_recommendation JSONB NOT NULL DEFAULT '{}'::jsonb,
    estimated_yield_impact VARCHAR(255),
    raw_ai_response JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Updated_at Trigger for Farms
DROP TRIGGER IF EXISTS trigger_farms_updated_at ON public.farms;
CREATE TRIGGER trigger_farms_updated_at
    BEFORE UPDATE ON public.farms
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 6. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_farms_user_id ON public.farms(user_id);
CREATE INDEX IF NOT EXISTS idx_advisories_farm_id ON public.advisories(farm_id);
CREATE INDEX IF NOT EXISTS idx_advisories_user_id ON public.advisories(user_id);
CREATE INDEX IF NOT EXISTS idx_advisories_created_at ON public.advisories(created_at DESC);

-- 7. Supabase Row Level Security (RLS) Configuration
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisories ENABLE ROW LEVEL SECURITY;

-- 8. RLS Policies: Farms Table
-- Service role has full unrestricted access
DROP POLICY IF EXISTS "Service role full access on farms" ON public.farms;
CREATE POLICY "Service role full access on farms"
    ON public.farms
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Authenticated and API users can only view their own farm profiles
DROP POLICY IF EXISTS "Users can view their own farms" ON public.farms;
CREATE POLICY "Users can view their own farms"
    ON public.farms
    FOR SELECT
    USING (
        auth.uid()::text = user_id 
        OR user_id = current_setting('request.headers', true)::json->>'x-user-id'
        OR auth.role() = 'anon'
    );

-- Users can insert farms belonging to themselves
DROP POLICY IF EXISTS "Users can create their own farms" ON public.farms;
CREATE POLICY "Users can create their own farms"
    ON public.farms
    FOR INSERT
    WITH CHECK (
        auth.uid()::text = user_id 
        OR user_id = coalesce(current_setting('request.headers', true)::json->>'x-user-id', user_id)
        OR auth.role() = 'anon'
    );

-- Users can update their own farms
DROP POLICY IF EXISTS "Users can update their own farms" ON public.farms;
CREATE POLICY "Users can update their own farms"
    ON public.farms
    FOR UPDATE
    USING (
        auth.uid()::text = user_id 
        OR user_id = current_setting('request.headers', true)::json->>'x-user-id'
        OR auth.role() = 'anon'
    );

-- Users can delete their own farms
DROP POLICY IF EXISTS "Users can delete their own farms" ON public.farms;
CREATE POLICY "Users can delete their own farms"
    ON public.farms
    FOR DELETE
    USING (
        auth.uid()::text = user_id 
        OR user_id = current_setting('request.headers', true)::json->>'x-user-id'
        OR auth.role() = 'anon'
    );

-- 9. RLS Policies: Advisories Table
-- Service role full access
DROP POLICY IF EXISTS "Service role full access on advisories" ON public.advisories;
CREATE POLICY "Service role full access on advisories"
    ON public.advisories
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Select advisories by tenant
DROP POLICY IF EXISTS "Users can view their own advisories" ON public.advisories;
CREATE POLICY "Users can view their own advisories"
    ON public.advisories
    FOR SELECT
    USING (
        auth.uid()::text = user_id 
        OR user_id = current_setting('request.headers', true)::json->>'x-user-id'
        OR auth.role() = 'anon'
    );

-- Insert advisories by tenant
DROP POLICY IF EXISTS "Users can insert their own advisories" ON public.advisories;
CREATE POLICY "Users can insert their own advisories"
    ON public.advisories
    FOR INSERT
    WITH CHECK (
        auth.uid()::text = user_id 
        OR user_id = coalesce(current_setting('request.headers', true)::json->>'x-user-id', user_id)
        OR auth.role() = 'anon'
    );

-- Delete advisories by tenant
DROP POLICY IF EXISTS "Users can delete their own advisories" ON public.advisories;
CREATE POLICY "Users can delete their own advisories"
    ON public.advisories
    FOR DELETE
    USING (
        auth.uid()::text = user_id 
        OR user_id = current_setting('request.headers', true)::json->>'x-user-id'
        OR auth.role() = 'anon'
    );
