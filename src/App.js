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
    const postsRef = firebase.database().ref("posts");
    post.slug = this.getNewSlugFromTitle(post.title);
    delete post.key;
    postsRef.push(post);
    this.setState({
      message: "saved",
    });

    setTimeout(() => {
      this.setState({ message: null });
    }, 1600);
  };

  updatePost = (post) => {
    const postRef = firebase.database().ref("posts" + post.key);
    postRef.update({
      slug: this.getNewSlugFromTitle(post.title),
      title: post.title,
      content: post.content,
    });
    this.setState({ message: "updated" });
    setTimeout(() => {
      this.setState({ message: null });
    });
  };

  deletePost = (post) => {
    if (window.confirm("Delete this post?")) {
      const postRef = firebase.database().ref("posts" / +post.key);
      postRef.remove();
      this.setState({ message: "deleted" });
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

  componentDidMount() {
    const postsRef = firebase.database().ref("posts");
    postsRef.on("value", (snapshot) => {
      const posts = snapshot.val();
      const newStatePosts = [];
      for (let post in posts) {
        newStatePosts.push({
          key: post,
          slug: posts[post].slug,
          title: posts[post].title,
          content: posts[post].content,
        });
      }
      this.setState({ posts: newStatePosts });
    });
  }

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
                      key: null,
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
