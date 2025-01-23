/* eslint-disable @next/next/no-img-element */
function ImageTag(props: any) {
  // eslint-disable-next-line jsx-a11y/alt-text
  return <img src={props.src} {...props} />;
}

export default ImageTag;
