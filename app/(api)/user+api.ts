import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    // Ensure DATABASE_URL is a string by throwing an error if it’s undefined
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error("DATABASE_URL environment variable is not set.");
    }

    // Pass the validated URL to neon
    const sql = neon(databaseUrl);

    // Parse JSON data from the request
    const { name, email, clerkId } = await request.json();

    // Check for missing fields
    if (!name || !email || !clerkId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Insert data into the 'users' table
    const response = await sql`
      INSERT INTO users (
        name, 
        email, 
        clerk_id
      ) 
      VALUES (
        ${name}, 
        ${email},
        ${clerkId}
      )
      RETURNING *;`; // Return inserted row(s) if needed

    // Return the response as JSON
    return new Response(JSON.stringify({ data: response }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating user:", error);

    // Error response with 500 status
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
