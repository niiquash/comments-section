import { useEffect, useState } from "react";
import axios, { CanceledError } from "axios";

interface Comment {
  id: number;
  name: string;
  body: string;
}

function App() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const controller = new AbortController();
    axios
      .get<Comment[]>("https://jsonplaceholder.typicode.com/comments", {
        signal: controller.signal,
      })
      .then((res) => {
        setLoading(false);
        setComments(res.data);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

  const updateComment = (comment: Comment) => {
    const originalComments = [...comments];

    // updating the UI
    const updateComment = {
      ...comment,
      body: comment.body + " COMMENT UPDATED!",
    };
    setComments(comments.map((c) => (c.id === comment.id ? updateComment : c)));

    // Calling the server
    axios
      .patch(
        "https://jsonplaceholder.typicode.com/comments/" + comment.id,
        updateComment
      )
      .catch((err) => {
        setError(err.message);
        setComments(originalComments);
      });
  };

  const deleteComment = (comment: Comment) => {
    // Updating the UI
    const originalComments = [...comments];
    setComments(comments.filter((c) => c.id !== comment.id));

    // Calling the server
    axios
      .delete("https://jsonplaceholder.typicode.com/comments/" + comment.id)
      .catch((err) => {
        setError(err.message);
        setComments(originalComments);
      });
  };

  const addComment = () => {
    const originalComments = [...comments];
    // Updating the UI
    const newComment = {
      id: 0,
      name: "Ammon Quarshie",
      body: "My wife doesn't want to go to IF",
    };
    setComments([...comments, newComment]);

    // Calling the server
    axios.post("https://jsonplaceholder.typicode.com/comments", newComment)
      .catch((err) => {
        setError(err.message);
        setComments(originalComments);
      });
  };

  return (
    <div className="App">
      {isLoading && <div className="spinner-border"></div>}
      {error && <p className="text-danger">{error}</p>}
      <button className="btn btn-primary mt-3 mb-3" onClick={addComment}>
        Add Comment
      </button>
      <ul className="list-group">
        {comments.map((comment) => (
          <li className="list-group-item" key={comment.id}>
            <p>Name: {comment.name}</p>
            <p>Body: {comment.body}</p>
            <div className="d-flex justify-content-start">
              <button
                className="btn btn-outline-primary mx-1"
                onClick={() => updateComment(comment)}
              >
                Update
              </button>
              <button
                className="btn btn-danger"
                onClick={() => deleteComment(comment)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
