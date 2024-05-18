// pages/api/airtable.js
export async function GET() {
  console.log("getting airtable data 🚀🚀🚀🚀");
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;

  const url = `https://api.airtable.com/v0/${baseId}/Database%20Cards?view=Grid%20view`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Cache-Control": "no-cache"
      },
      cache: "no-store"
    });

    console.log(response, "what is response here? 🐼🐼🐼🐼");
    if (!response.ok) {
      // Log more details about the failed request
      console.error(
        `Failed to fetch Airtable data: HTTP status ${response.status} ${response.statusText}`
      );
      throw new Error(
        `Failed to fetch Airtable data: HTTP status ${response.status} ${response.statusText}`
      );
    }

    const { records } = await response.json();
    return new Response(
      JSON.stringify({
        message: "Records retrieved 🍬🍬🍬",
        records: records
      })
    );
  } catch (error) {
    console.error("Error getting Airtable data", error.message);
    throw new Error(`Error getting Airtable data: ${error.message}`);
  }
}

// 💠 get airtable data
// arrange airtable data fit for writing
// 💠 write airtable data to filesystem
// 💠 upload to ipfs
