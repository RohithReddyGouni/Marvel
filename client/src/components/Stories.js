import React, { useEffect } from "react";
import { Route, useParams, Routes, Link } from "react-router-dom";
import axios from "axios";
import { Col, Row } from "react-bootstrap";
import Story from "./Story";
import ErrorPage from "./ErrorPage";

const Stories = () => {
  let { page } = useParams();
  const [stories, setStories] = React.useState([]);
  const [totalStories, setTotalStories] = React.useState(0);
  let storiesPerPage = 20;
  let offset = (page - 1) * storiesPerPage;
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const url = `http://localhost:4000/api/stories/page/${page}`;
  const [searchTerm, setSearchTerm] = React.useState("");

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();
    let getStories = async () => {
      try {
        const response = await axios.get(url, {
          cancelToken: cancelToken.token,
        });
        setStories(response.data.data.results);
        setTotalStories(response.data.data.total);
        setError(false);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };
    if (searchTerm.trim() === "") {
      getStories();
    }

    return () => {
      cancelToken.cancel();
    };
  }, [url, searchTerm]);

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();
    let searchStories = async (searchTerm) => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:4000/api/stories/search/${searchTerm}?page=${page}`,
          {
            cancelToken: cancelToken.token,
          }
        );
        setStories(response.data.data.results);
        setTotalStories(response.data.data.total);
        setError(false);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };
    if (searchTerm.trim() !== "") {
      searchStories(searchTerm);
    }

    return () => {
      cancelToken.cancel();
    };
  }, [searchTerm, page]);

  return (
    <div>
      {!loading && !error ? (
        <>
          <h2>Stories</h2>
          <div className="search" style={{ marginBottom: "20px" }}>
            <label>
              <input
                type="text"
                id="StorySearch"
                placeholder="Enter comic id"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    document.getElementById("searchButton").click();
                  }
                }}
              />
            </label>
            <Link
              to={`/stories/page/1`}
              id="searchButton"
              className="btn btn-primary btn-sm"
              onClick={() => {
                setSearchTerm(document.getElementById("StorySearch").value);
              }}
              style={{ marginLeft: "10px" }}
            >
              Search
            </Link>
          </div>
          <Col xs={12} md={12} lg={12}>
            {page !== "1" && (
              <Link
                to={`/stories/page/${parseInt(page) - 1}`}
                className="btn btn-primary btn-sm me-5"
                onClick={() => {
                  page = parseInt(page) - 1;
                  setLoading(true);
                }}
              >
                Previous
              </Link>
            )}
            {offset + storiesPerPage < totalStories && (
              <Link
                to={`/stories/page/${parseInt(page) + 1}`}
                className="btn btn-primary btn-sm ms-5"
                onClick={() => {
                  page = parseInt(page) + 1;
                  setLoading(true);
                }}
              >
                Next
              </Link>
            )}
            <Routes>
              <Route path="/page/:page" element={<Story stories={stories} />} />
            </Routes>
          </Col>
          <Row>
            <Story stories={stories} />
          </Row>
        </>
      ) : null}
      {loading && !error ? <h1>Loading...</h1> : null}
      {error && !loading ? <ErrorPage /> : null}
    </div>
  );
};

export default Stories;
