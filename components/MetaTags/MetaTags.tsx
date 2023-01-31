/* eslint-disable react/require-default-props */
import * as React from 'react';

interface SEOProps {
  title?: string;
  image?: string;
  description?: string;
}

const AUTHOR = 'Karl Mosche, Alexander Carol, Leniolabs_';
const SITE_URL = 'https://wdvp.leniolabs.com/lenio-wgs';
const BASE_DESCRIPTION = 'Visualization dashboard of the present future visualization.';
const BASE_TITLE = 'World Data Visualization';
const BASE_IMAGE = 'https://wdvp.leniolabs.com/lenio-wgs/wdvp.png';

export function MetaTags(props: SEOProps) {
  const { title: _title, description: _description, image: _image } = props;

  const title = React.useMemo(() => _title || BASE_TITLE, [_title]);

  const image = React.useMemo(() => {
    if (_image && _image.includes('http')) {
      return _image;
    } if (_image) {
      return `${SITE_URL}${_image}`;
    }
    return `${SITE_URL}${BASE_IMAGE}`;
  }, [_image]);

  const description = React.useMemo(
    () => _description || BASE_DESCRIPTION,
    [_description],
  );

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="icon" href={`${SITE_URL}rocket_launch.png`} />
      <meta name="canonical" content={SITE_URL} />

      <meta name="type" property="og:type" content="website" />
      <meta name="url" property="og:url" content={SITE_URL} />
      <meta name="title" property="og:title" content={title} />
      <meta
        name="description"
        property="og:description"
        content={description}
      />
      <meta name="image" property="og:image" content={image} />

      <meta
        name="twitter card"
        property="twitter:card"
        content="summary_large_image"
      />
      <meta name="twitter url" property="twitter:url" content={SITE_URL} />
      <meta name="twitter title" property="twitter:title" content={title} />
      <meta
        name="twitter description"
        property="twitter:description"
        content={description}
      />
      <meta name="twitter image" property="twitter:image" content={image} />
      <meta
        name="twitter creator"
        property="twitter:creator"
        content={AUTHOR}
      />
    </>
  );
}
