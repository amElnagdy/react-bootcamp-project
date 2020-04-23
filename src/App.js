import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import SimpleStorage from "react-simple-storage";
import "./App.css";
import Header from "./components/Header";
import Posts from "./components/Posts";
import Post from "./components/Post";
import NotFound from "./components/NotFound";
import PostForm from "./components/PostForm";
import Message from "./components/Message";
import Login from "./components/Login";
import firebase from "./firebase";

class App extends React.Component {
  state = {
    posts: [],
    message: null,
    isAuthinticated: false,
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

  onLogin = (email, password) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        this.setState({ isAuthinticated: true });
      })
      .catch((error) => console.error(error));
  };

  onLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => this.setState({ isAuthinticated: false }))
      .catch((error) => console.log(error));
  };

  render() {
    return (
      <Router>
        <div className="App">
          <SimpleStorage parent={this} />
          <Header
            isAuthinticated={this.state.isAuthinticated}
            onLogout={this.onLogout}
          />
          {this.state.message && <Message type={this.state.message} />}
          <Switch>
            <Route
              exact
              path="/"
              render={() => (
                <Posts
                  posts={this.state.posts}
                  deletePost={this.deletePost}
                  isAuthinticated={this.state.isAuthinticated}
                />
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
              path="/login"
              render={() =>
                !this.state.isAuthinticated ? (
                  <Login onLogin={this.onLogin} />
                ) : (
                  <Redirect to="/" />
                )
              }
            />
            <Route
              exact
              path="/new/"
              render={() =>
                this.state.isAuthinticated ? (
                  <PostForm
                    addNewPost={this.addNewPost}
                    post={{
                      id: 0,
                      slug: "",
                      title: "",
                      content: "",
                    }}
                  />
                ) : (
                  <Redirect to="/" />
                )
              }
            />
            <Route
              path="/edit/:postSlug"
              render={(props) => {
                const post = this.state.posts.find(
                  (post) => post.slug === props.match.params.postSlug
                );
                if (post && this.state.isAuthinticated) {
                  return <PostForm post={post} updatePost={this.updatePost} />;
                } else if (post && !this.state.isAuthinticated) {
                  return <Redirect to="/" />;
                } else return <Redirect to="/" />;
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
