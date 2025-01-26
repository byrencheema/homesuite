import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log('Hello from Proximity Search function!')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { location, radius } = await req.json()
    const melissaApiKey = Deno.env.get('MELISSA_API_KEY')
    
    if (!melissaApiKey) {
      throw new Error('Melissa API key not configured')
    }

    // First, geocode the location using Melissa API
    const geocodeUrl = `https://personator.melissadata.net/v3/web/personatorsearch/doPersonatorSearch?id=${melissaApiKey}&format=json&cols=latitude,longitude&ff=A1&a1=${encodeURIComponent(location)}`
    
    console.log('Geocoding location:', location)
    const geocodeResponse = await fetch(geocodeUrl)
    const geocodeData = await geocodeResponse.json()
    
    console.log('Geocode response:', geocodeData)

    if (!geocodeData.Records?.[0]?.latitude || !geocodeData.Records?.[0]?.longitude) {
      throw new Error('Could not geocode location')
    }

    const { latitude, longitude } = geocodeData.Records[0]

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration missing')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Query homes within radius using Postgres earth distance functions
    const { data: homes, error } = await supabase.rpc('find_homes_within_radius', {
      p_latitude: latitude,
      p_longitude: longitude,
      p_radius_miles: radius
    })

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({ homes }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )
  }
})