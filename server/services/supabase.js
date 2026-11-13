import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey && !supabaseUrl.includes('[YOUR-PROJECT-REF]') && !supabaseKey.includes('your_supabase_anon_key')) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    console.log('✅ Supabase Client initialized successfully.');
  } catch (err) {
    console.warn('⚠️  Failed to initialize Supabase client:', err.message);
  }
}

export function isSupabaseConfigured() {
  return Boolean(supabase);
}

export function getSupabaseClient() {
  return supabase;
}

/**
 * Uploads crop leaf photo to Supabase Storage bucket 'crop-images'
 * If bucket doesn't exist, auto-creates it as public.
 * Falls back gracefully to null if Supabase Storage is unconfigured.
 */
export async function uploadCropImage(buffer, originalFilename = 'leaf.jpg', mimeType = 'image/jpeg') {
  if (!supabase) return null;

  try {
    const bucketName = 'crop-images';
    const ext = mimeType === 'image/png' ? 'png' : mimeType === 'image/webp' ? 'webp' : 'jpg';
    const fileName = `diagnoses/${Date.now()}-${uuidv4().substring(0, 8)}.${ext}`;

    // Ensure bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets && buckets.some((b) => b.name === bucketName);

    if (!bucketExists) {
      try {
        await supabase.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: 5242880, // 5MB
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
        });
      } catch (bucketErr) {
        // Bucket creation might already be done or restricted by policy
      }
    }

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, buffer, {
        contentType: mimeType,
        upsert: false
      });

    if (uploadError) {
      console.warn('⚠️  Supabase storage upload error:', uploadError.message);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    return urlData?.publicUrl || null;
  } catch (err) {
    console.warn('⚠️  Supabase image upload exception:', err.message);
    return null;
  }
}
