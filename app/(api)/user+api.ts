import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    // Ensure the database URL is configured
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error("DATABASE_URL environment variable is not set.");
    }

    // Initialize the Neon connection
    const sql = neon(databaseUrl);

    // Parse the incoming request body
    const { parentName, childName, email, clerkId, profilePictureFilename } =
      await request.json();

    // Validate required fields
    if (!parentName || !childName || !email || !clerkId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email format." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Insert the user into the database
    const response = await sql`
      INSERT INTO users (
        parent_name,
        child_name,
        email,
        clerk_id,
        profile_picture_url
      ) VALUES (
        ${parentName},
        ${childName},
        ${email},
        ${clerkId},
        ${profilePictureFilename || null}
      )
      RETURNING *;
    `;

    // Return the inserted user data
    return new Response(
      JSON.stringify({
        message: "User created successfully.",
        data: response,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error creating user:", error);

    // Handle duplicate key error (e.g., email or clerk_id already exists)
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return new Response(JSON.stringify({ error: "User already exists." }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Handle all other errors
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
