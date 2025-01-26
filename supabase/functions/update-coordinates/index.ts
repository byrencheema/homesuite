import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log('Starting coordinate update function')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const melissaApiKey = Deno.env.get('MELISSA_API_KEY')
    
    if (!supabaseUrl || !supabaseKey || !melissaApiKey) {
      throw new Error('Missing required environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get all homes without coordinates
    const { data: homes, error: fetchError } = await supabase
      .from('homes')
      .select('id, city, state')
      .or('latitude.is.null,longitude.is.null')

    if (fetchError) throw fetchError

    console.log(`Found ${homes?.length || 0} homes needing coordinate updates`)

    // Update coordinates for each home
    for (const home of homes || []) {
      try {
        const location = `${home.city}, ${home.state}`
        console.log(`Geocoding location: ${location}`)

        // Use Melissa API to get coordinates
        const geocodeUrl = `https://personator.melissadata.net/v3/web/personatorsearch/doPersonatorSearch?id=${melissaApiKey}&format=json&cols=latitude,longitude&ff=A1&a1=${encodeURIComponent(location)}`
        const geocodeResponse = await fetch(geocodeUrl)
        const geocodeData = await geocodeResponse.json()

        if (geocodeData.Records?.[0]?.latitude && geocodeData.Records?.[0]?.longitude) {
          const { latitude, longitude } = geocodeData.Records[0]
          
          // Update the home with new coordinates
          const { error: updateError } = await supabase
            .from('homes')
            .update({
              latitude,
              longitude,
            })
            .eq('id', home.id)

          if (updateError) {
            console.error(`Error updating home ${home.id}:`, updateError)
            continue
          }

          console.log(`Updated coordinates for ${location}: ${latitude}, ${longitude}`)
        } else {
          console.error(`No coordinates found for ${location}`)
        }

        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (error) {
        console.error(`Error processing home ${home.id}:`, error)
      }
    }

    return new Response(
      JSON.stringify({ 
        message: `Processed ${homes?.length || 0} homes`,
      }),
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
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      }),
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