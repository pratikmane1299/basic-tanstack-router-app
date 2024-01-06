/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Await,
  Link,
  NotFoundRoute,
  Outlet,
  RootRoute,
  Route,
  Router,
  RouterProvider,
  defer,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import "./App.css";
import {
  fetchPostById,
  fetchPosts,
  fetchUserById,
  fetchUserPosts,
  fetchUserTodos,
  fetchUsers,
} from "./data";
import { Suspense } from "react";

const rootRoute = new RootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{" "}
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: function Index() {
    return <Home />;
  },
});

const postsRoute = new Route({
  getParentRoute: () => indexRoute,
  path: "/posts",
  component: () => {
    return <Outlet />;
  },
});

const postsIndexRoute = new Route({
  getParentRoute: () => postsRoute,
  path: "/",
  component: function Posts() {
    const { postsPromise } = postsIndexRoute.useLoaderData();

    return (
      <div className="mt-10 flex flex-col text-left">
        <h5 className="mb-10 font-bold text-2xl">Posts</h5>
        <Suspense fallback={<div>Loading posts...</div>}>
          <Await promise={postsPromise}>
            {(posts: any) => (
              <>
                {posts.length > 0 && (
                  <ul className="flex flex-col space-y-4">
                    {posts.map((post: any) => (
                      <Link
                        to={"/posts/$postId"}
                        params={{ postId: post.id }}
                        key={post.id}
                        className="shadow bg-gray-50 rounded-md p-4"
                      >
                        <h6 className="text-xl font-semibold">{post.title}</h6>
                        <p className="text-sm font-medium tracking-tight">
                          {post.body}
                        </p>
                      </Link>
                    ))}
                  </ul>
                )}
              </>
            )}
          </Await>
        </Suspense>
      </div>
    );
  },
  loader: () => {
    const postsPromise = fetchPosts();

    return { postsPromise: defer(postsPromise) };
  },
  staleTime: Infinity,
  pendingMs: 500,
});

const postRoute = new Route({
  path: "/$postId",
  getParentRoute: () => postsRoute,
  loader: ({ params }) => {
    return fetchPostById(+params.postId);
  },
  component: () => {
    const post = postRoute.useLoaderData();
    return (
      <div className="mt-10 text-left">
        <h5 className="text-2xl font-bold mb-10">Cool Post</h5>
        {post ? (
          <div>
            <h1>{post.title}</h1>
            <p>{post.body}</p>
          </div>
        ) : (
          "Post not found"
        )}
      </div>
    );
  },
});

const usersRoute = new Route({
  getParentRoute: () => indexRoute,
  path: "/users",
  component: function Users() {
    return <Outlet />;
  },
});

const usersIndexRoute = new Route({
  getParentRoute: () => usersRoute,
  path: "/",
  loader: () => {
    const usersPromise = fetchUsers();

    return { usersPromise: defer(usersPromise) };
  },
  component: function Users() {
    const { usersPromise } = usersIndexRoute.useLoaderData();
    return (
      <div className="mt-10 flex flex-col text-left">
        <h5 className="mb-10 font-bold text-2xl">Users</h5>
        <Suspense fallback={<div>Loading users...</div>}>
          <Await promise={usersPromise}>
            {(users: any) => (
              <>
                {users.length > 0 && (
                  <ul className="flex flex-col space-y-4">
                    {users.map((user: any) => (
                      <Link
                        to={"/users/$userId"}
                        params={{ userId: user.id }}
                        key={user.id}
                        className="shadow bg-gray-50 rounded-md p-4"
                      >
                        <div>
                          <h6 className="text-xl font-semibold">{user.name}</h6>
                          <span>{user.username}</span>
                        </div>
                      </Link>
                    ))}
                  </ul>
                )}
              </>
            )}
          </Await>
        </Suspense>
      </div>
    );
  },
});

const userRoute = new Route({
  getParentRoute: () => usersRoute,
  path: "$userId",
  loader: ({ params }) => fetchUserById(+params.userId),
  component: () => {
    const user = userRoute.useLoaderData();
    const { userId } = userRoute.useParams();
    return (
      <div className="mt-10 text-left">
        <h5 className="text-2xl font-bold mb-10">User</h5>
        {user ? (
          <div>
            <h1>{user.name}</h1>
            <p>{user.email}</p>

            <div className="mt-5">
              <ul className="flex gap-5 bg-gray-100 rounded-md w-fit p-4">
                <li>
                  <Link
                    to={"/users/$userId"}
                    params={{ userId }}
                    className="p-2 rounded-md "
                    activeProps={{
                      className: "bg-blue-600 text-white font-semibold",
                    }}
                    activeOptions={{ exact: true }}
                  >
                    Details
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/users/$userId/posts"}
                    params={{ userId }}
                    className="p-2 rounded-md "
                    activeProps={{
                      className: "bg-blue-600 text-white font-semibold",
                    }}
                  >
                    Posts
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/users/$userId/todos"}
                    params={{ userId }}
                    className="p-2 rounded-md "
                    activeProps={{
                      className: "bg-blue-600 text-white font-semibold",
                    }}
                  >
                    Todos
                  </Link>
                </li>
              </ul>

              <div>
                <Outlet />
              </div>
            </div>
          </div>
        ) : (
          "User not found"
        )}
      </div>
    );
  },
});

const userIndexRoute = new Route({
  path: `/`,
  getParentRoute: () => userRoute,
  loader: ({ params }) => fetchUserById(+params.userId),
  component: () => {
    const user = userIndexRoute.useLoaderData();
    return (
      <div className="mt-10">
        {user ? (
          <div className="space-y-2">
            <span className="block"><strong>Email:</strong> {user.email}</span>
            <span className="block"><strong>City:</strong> {user.address.city}</span>
            <span className="block"><strong>Website:</strong> {user.website}</span>
          </div>
        ) : (
          "User not found"
        )}{" "}
      </div>
    );
  },
});

const userPostsRoute = new Route({
  getParentRoute: () => userRoute,
  path: "/posts",
  loader: ({ params }) => fetchUserPosts(+params.userId),
  component: () => {
    const posts = userPostsRoute.useLoaderData();

    return (
      <div className="mt-10">
        <h5 className="mb-10 text-xl font-semibold">User posts</h5>
        {posts.length > 0 ? (
          <ul className="flex flex-col space-y-5">
            {posts.map((post: any) => (
              <Link
                to={"/posts/$postId"}
                params={{ postId: post.id }}
                key={post.id}
                className="shadow bg-gray-50 rounded-md p-4"
              >
                <h6 className="text-xl font-semibold">{post.title}</h6>
                <p className="text-sm font-medium tracking-tight">
                  {post.body}
                </p>
              </Link>
            ))}
          </ul>
        ) : (
          "No posts found for this user."
        )}
      </div>
    );
  },
});

const userTodosRoute = new Route({
  getParentRoute: () => userRoute,
  path: "/todos",
  loader: ({ params }) => {
    return fetchUserTodos(+params.userId);
  },
  component: () => {
    const todos = userTodosRoute.useLoaderData();

    return (
      <div className="mt-10">
        <h5 className="mb-10 text-xl font-semibold">User todos</h5>
        {todos.length > 0 ? (
          <ul className="flex flex-col space-y-5">
            {todos.map((todo: any) => (
              <li key={todo.id} className="shadow bg-gray-50 rounded-md p-4">
                <h6 className="text-xl font-semibold">{todo.title}</h6>
                <p className="text-sm font-medium tracking-tight">
                  <span>completed: </span>
                  <input
                    type="checkbox"
                    defaultChecked={todo.completed}
                    readOnly
                  />
                </p>
              </li>
            ))}
          </ul>
        ) : (
          "No todos found for this user."
        )}
      </div>
    );
  },
});

const userNotFoundRoute = new Route({
  getParentRoute: () => usersRoute,
  path: "*",
  component: () => {
    return <div>The user you are looking for doesn't exists</div>;
  },
});

function Home() {
  return (
    <div className="p-2">
      <h3>Tanstack router example</h3>

      <div>
        <nav>
          <ul className="p-2 flex gap-2">
            <li>
              <Link to={"/posts"}>
                {({ isActive }) => (
                  <span className={isActive ? "font-bold" : "font-normal"}>
                    Posts
                  </span>
                )}
              </Link>
            </li>

            <li>
              <Link to={"/users"}>
                {({ isActive }) => (
                  <span className={isActive ? "font-bold" : "font-normal"}>
                    Users
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </nav>
        <hr />

        <Outlet />
      </div>
    </div>
  );
}

const aboutRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: function About() {
    return <div className="p-2">Hello from About!</div>;
  },
});

const profileRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: function Profile() {
    return <div>Profile route</div>;
  },
});

const globalNotFound = new NotFoundRoute({
  getParentRoute: () => rootRoute,
  component: () => {
    return <div>global 404 route</div>;
  },
});

const routeTree = rootRoute.addChildren([
  indexRoute.addChildren([
    postsRoute.addChildren([postsIndexRoute, postRoute]),
    usersRoute.addChildren([
      usersIndexRoute,
      userRoute.addChildren([userIndexRoute, userPostsRoute, userTodosRoute]),
      userNotFoundRoute,
    ]),
  ]),
  aboutRoute,
  profileRoute,
]);

const router = new Router({
  routeTree,
  defaultPreload: "intent",
  notFoundRoute: globalNotFound,
  context: {
    fetchUserById,
  },
});

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
