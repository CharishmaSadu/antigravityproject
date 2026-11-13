CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Farms Table
CREATE TABLE IF NOT EXISTS farms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) NOT NULL,
    farm_name VARCHAR(150) NOT NULL,
    location_region VARCHAR(150) NOT NULL,
    soil_type VARCHAR(50) NOT NULL,
    soil_ph NUMERIC(3,1),
    total_area_acres NUMERIC(8,2),
    irrigation_type VARCHAR(50),
    primary_crops TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Advisories Table
CREATE TABLE IF NOT EXISTS advisories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    crop_name VARCHAR(100) NOT NULL,
    symptom_description TEXT NOT NULL,
    image_url TEXT,
    diagnosis_title VARCHAR(255) NOT NULL,
    confidence_score INTEGER CHECK (confidence_score BETWEEN 0 AND 100),
    severity_level VARCHAR(50) NOT NULL,
    issue_category VARCHAR(100) NOT NULL,
    organic_remedies JSONB NOT NULL,
    chemical_treatments JSONB NOT NULL,
    preventative_measures JSONB NOT NULL,
    fertilizer_recommendation JSONB NOT NULL,
    estimated_yield_impact VARCHAR(255),
    raw_ai_response JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_farms_user_id ON farms(user_id);
CREATE INDEX IF NOT EXISTS idx_advisories_farm_id ON advisories(farm_id);
CREATE INDEX IF NOT EXISTS idx_advisories_user_id ON advisories(user_id);
