var QUERY = `
  query($owner: String!, $repo: String!, $categoryId: ID!, $first: Int!) {
    repository(owner: $owner, name: $repo) {
      discussions(
        first: $first,
        categoryId: $categoryId,
        orderBy: { field: CREATED_AT, direction: DESC }
      ) {
        nodes {
          title
          url
          createdAt
          body
          author { login avatarUrl }
          labels(first: 5) { nodes { name color } }
        }
      }
    }
  }
`;

export async function onRequestGet(context) {
  var token = context.env.GITHUB_TOKEN;
  if (!token) {
    return Response.json(
      { discussions: [], error: "GITHUB_TOKEN not configured" },
      { status: 200, headers: responseHeaders() }
    );
  }

  try {
    var categoryId = await getAnnouncementsCategoryId(token);
    if (!categoryId) {
      return Response.json(
        { discussions: [] },
        { headers: responseHeaders() }
      );
    }

    var res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "User-Agent": "soleri-website",
      },
      body: JSON.stringify({
        query: QUERY,
        variables: {
          owner: "adrozdenko",
          repo: "soleri",
          categoryId: categoryId,
          first: 10,
        },
      }),
    });

    if (!res.ok) {
      return Response.json(
        { discussions: [], error: "GitHub API error: " + res.status },
        { status: 200, headers: responseHeaders() }
      );
    }

    var data = await res.json();
    var nodes = data.data?.repository?.discussions?.nodes || [];

    var discussions = nodes.map(function (d) {
      return {
        title: d.title,
        url: d.url,
        createdAt: d.createdAt,
        excerpt: plainText(d.body).slice(0, 200),
        author: d.author?.login || "soleri",
        avatarUrl: d.author?.avatarUrl || null,
        labels: (d.labels?.nodes || []).map(function (l) {
          return { name: l.name, color: l.color };
        }),
      };
    });

    return Response.json(
      { discussions: discussions },
      { headers: responseHeaders() }
    );
  } catch (e) {
    return Response.json(
      { discussions: [], error: e.message },
      { status: 200, headers: responseHeaders() }
    );
  }
}

var CATEGORY_QUERY = `
  query($owner: String!, $repo: String!) {
    repository(owner: $owner, name: $repo) {
      discussionCategories(first: 25) {
        nodes { id name }
      }
    }
  }
`;

async function getAnnouncementsCategoryId(token) {
  var res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
      "User-Agent": "soleri-website",
    },
    body: JSON.stringify({
      query: CATEGORY_QUERY,
      variables: { owner: "adrozdenko", repo: "soleri" },
    }),
  });

  if (!res.ok) return null;

  var data = await res.json();
  var categories = data.data?.repository?.discussionCategories?.nodes || [];
  var announcements = categories.find(function (c) {
    return c.name.toLowerCase() === "announcements";
  });

  return announcements ? announcements.id : null;
}

function plainText(markdown) {
  if (!markdown) return "";
  return markdown
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "")
    .replace(/>\s+/g, "")
    .replace(/[-*+]\s+/g, "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function responseHeaders() {
  return {
    "Content-Type": "application/json",
    "Cache-Control": "public, max-age=1800",
    "Access-Control-Allow-Origin": "*",
  };
}
