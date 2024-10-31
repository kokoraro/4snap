function ImageTag(props: any) {
  return <img src={props.src} {...props} crossOrigin={"true"} />;
}

export default ImageTag;
