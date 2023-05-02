import React from "react";
import { Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import NotFoundInage from "../image/image-not-found.jpg";

const Story = ({ stories }) => {
  return (
    <>
      {stories.map((story) => (
        <Col xs={12} md={6} lg={4} className="text-center mt-5" key={story.id}>
          <Link to={"/stories/" + story.id}>
            <div className="border border-dark rounded p-2">
              <h3>{story.title}</h3>
              {story.thumbnail ? (
                <img
                  src={story.thumbnail.path + "." + story.thumbnail.extension}
                  alt={story.title}
                />
              ) : (
                <img src={NotFoundInage} alt={story.title} />
              )}
            </div>
          </Link>
        </Col>
      ))}
    </>
  );
};

export default Story;
