import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";

function Community() {
  const [posts, setPosts] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedTag, setSelectedTag] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: [],
    images: [],
  });

  const tags = ["tips", "success-story", "help", "showcase", "discussion"];

  useEffect(() => {
    fetchPosts();
  }, [selectedTag]);

  const fetchPosts = async () => {
    try {
      const url = selectedTag
        ? `/community/posts/tag/${selectedTag}`
        : "/community/posts";
      const res = await API.get(url);
      // Ensure posts is always an array
      setPosts(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]); // Set empty array on error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/community/posts/${editingId}`, formData);
      } else {
        await API.post("/community/posts", formData);
      }
      fetchPosts();
      resetForm();
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  const handleLike = async (postId) => {
    try {
      await API.post(`/community/posts/${postId}/like`);
      fetchPosts();
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleEdit = (post) => {
    setFormData({
      title: post.title,
      content: post.content,
      tags: post.tags || [],
      images: post.images || [],
    });
    setEditingId(post.id);
    setShowPostForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/community/posts/${id}`);
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleTagToggle = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      tags: [],
      images: [],
    });
    setEditingId(null);
    setShowPostForm(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-green-700 mb-6">
          Community Garden
        </h2>

        {/* Tag Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Filter by Tag</label>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedTag("")}
              className={`px-4 py-2 rounded-lg transition ${
                selectedTag === ""
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All Posts
            </button>
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-lg transition capitalize ${
                  selectedTag === tag
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Create Post Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowPostForm(!showPostForm)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            {showPostForm ? "Cancel" : "+ Create Post"}
          </button>
        </div>

        {/* Post Form */}
        {showPostForm && (
          <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
            <h3 className="text-xl font-semibold mb-4">
              {editingId ? "Edit Post" : "Create New Post"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  className="w-full border p-2 rounded-lg focus:outline-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  rows="6"
                  required
                  className="w-full border p-2 rounded-lg focus:outline-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <div className="flex gap-2 flex-wrap">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagToggle(tag)}
                      className={`px-3 py-1 rounded-full text-sm transition capitalize ${
                        formData.tags.includes(tag)
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  {editingId ? "Update Post" : "Create Post"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Posts List */}
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Community Posts {selectedTag && `(#${selectedTag})`}
          </h3>
          {posts.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              No posts found 🌿
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-1">
                        {post.title}
                      </h4>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span>by {post.users?.name || "Anonymous"}</span>
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleLike(post.id)}
                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 transition"
                      >
                        ❤️ {post.likes || 0}
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 whitespace-pre-wrap">
                    {post.content}
                  </p>

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex gap-2 mb-4">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs capitalize"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span>💬 {post.comments?.[0]?.count || 0} comments</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Community;
