import React from "react";
import { Link } from "react-router-dom";
import { Col } from "react-bootstrap";

const Comic = ({ comics }) => {
  return (
    <>
      {comics.map((comic) => (
        <Col xs={12} md={6} lg={4} className="text-center mt-5" key={comic.id}>
          <Link to={"/comics/" + comic.id}>
            <div className="border border-dark rounded p-2">
              <h3>{comic.title}</h3>
              <img
                src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
                alt={comic.title}
                width="350"
                height="250"
              />
            </div>
          </Link>
        </Col>
      ))}
    </>
  );
};

export default Comic;
