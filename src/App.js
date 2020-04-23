import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Posts from "./components/Posts";
import Post from "./components/Post";
import NotFound from "./components/NotFound";
import PostForm from "./components/PostForm";
import Message from "./components/Message";

class App extends React.Component {
  state = {
    posts: [
      {
        id: 1,
        slug: "hello-world",
        title: "Hello World",
        content: "Lorem.",
      },
      {
        id: 2,
        slug: "hello-project",
        title: "Hello Project",
        content: "Tothe",
      },
      {
        id: 3,
        slug: "hello-blog",
        title: "Hello Blog",
        content: "Ipsum.",
      },
    ],
    message: null,
  };

  getNewSlugFromTitle = (title) =>
    encodeURIComponent(title.toLowerCase().split(" ").join("-"));

  addNewPost = (post) => {
    post.id = this.state.posts.length + 1;
    post.slug = this.getNewSlugFromTitle(post.title);
    this.setState({
      posts: [...this.state.posts, post],
      message: "saved",
    });

    setTimeout(() => {
      this.setState({ message: null });
    }, 1600);
  };

  updatePost = (post) => {
    post.slug = this.getNewSlugFromTitle(post.title);
    const index = this.state.posts.findIndex((p) => p.id === post.id);
    const posts = this.state.posts
      .slice(0, index)
      .concat(this.state.posts.slice(index + 1));
    const newPosts = [...posts, post].sort((a, b) => a.id - b.id);
    this.setState(
      {
        posts: newPosts,
        message: "updated",
      },
      setTimeout(() => {
        this.setState({ message: null });
      }),
      1600
    );
  };

  deletePost = (post) => {
    if (window.confirm("Delete this post?")) {
      const posts = this.state.posts.filter((p) => p.id !== post.id);
      this.setState({ posts, message: "deleted" });
      setTimeout(() => {
        this.setState({ message: null });
      }, 1600);
    }
  };

  render() {
    return (
      <Router>
        <div className="App">
          <Header />
          {this.state.message && <Message type={this.state.message} />}
          <Switch>
            <Route
              exact
              path="/"
              render={() => (
                <Posts posts={this.state.posts} deletePost={this.deletePost} />
              )}
            />
            <Route
              path="/post/:postSlug"
              render={(props) => {
                const post = this.state.posts.find(
                  (post) => post.slug === props.match.params.postSlug
                );
                if (post) return <Post post={post} />;
                else return <NotFound />;
              }}
            />
            <Route
              exact
              path="/new/"
              render={() => (
                <PostForm
                  addNewPost={this.addNewPost}
                  post={{
                    id: 0,
                    slug: "",
                    title: "",
                    content: "",
                  }}
                />
              )}
            />
            <Route
              path="/edit/:postSlug"
              render={(props) => {
                const post = this.state.posts.find(
                  (post) => post.slug === props.match.params.postSlug
                );
                if (post)
                  return <PostForm post={post} updatePost={this.updatePost} />;
                else return <Redirect to="/" />;
              }}
            />
            <Route component={NotFound} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
