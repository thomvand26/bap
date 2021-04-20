import { useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import { useFormik, Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Input } from '../../../components/Inputs/Input';
import styles from './createShow.module.scss';
import { useGoogleApi } from '../../../context/GoogleApiContext';
import { useShow } from '@/context';

const YouTubePlayerOptions = {
  // height: '390',
  // width: '640',
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    autoplay: 1,
    disablekb: 1,
    fs: 0,
    rel: 0,
  },
};

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Too short!')
    .max(50, 'Too long!')
    .required('Required'),
  videoId: Yup.string()
    .min(3, 'Too short!')
    .max(50, 'Too long!')
    .required('Required'),
});

export default function CreateShowPage() {
  const [videoURLInput, setVideoURLInput] = useState();
  const [videoId, setVideoId] = useState();
  const [showTitle, setShowTitle] = useState();
  const [previewVideoId, setPreviewVideoIdId] = useState();
  const { handleSignIn } = useGoogleApi();
  const { createShow, goToShow } = useShow();

  useEffect(() => {
    // const searchParams = videoURLInput?.split?.(/\?v=|\&v=/)
    const searchParams = videoURLInput?.split?.(/\?|\&/).map((paramString) => {
      const [key, value] = paramString.split('=');
      return { key, value };
    });
    const id =
      searchParams?.find?.((param) => param.key === 'v')?.value ||
      videoURLInput;
    setVideoId(id);
  }, [videoURLInput]);

  useEffect(() => {
    setPreviewVideoIdId(videoId);
  }, [videoId]);

  // const { handleSubmit, handleChange, values } = useFormik({
  //   initialValues: {
  //     title: '',
  //     videoId: '',
  //   },
  //   validationSchema,
  //   onSubmit: (values) => {
  //     console.log(values);
  //   },
  // });

  const handleSubmit = (values) => {
    createShow(values, (response) => goToShow(response));
  };

  const updatePreview = (event) => {
    event.preventDefault();
    // setPreviewVideoIdId(videoId);
    // console.log('updatePreview');
  };

  // const handleCreateClick = (event) => {
  //   console.log(event);
  // };

  const handleYTAuthClick = async (event) => {
    console.log('test');
    handleSignIn();
  };

  return (
    <div className={styles.page}>
      <h2 className="pageHeader">Create a show</h2>
      <Formik
        validationSchema={validationSchema}
        initialValues={{ title: '', videoId: '' }}
        onSubmit={handleSubmit}
      >
        {/* {() => ( */}
        <Form
          className={styles.form}
          onChange={(event) =>
            event?.target?.id === 'videoId' &&
            setVideoURLInput(event.target?.value?.trim?.())
          }
        >
          <div className={styles.formContent}>
            <div className={styles.general}>
              <h3>General</h3>
              <Input
                name="title"
                label="Show Title"
                type="text"
                autoComplete="off"
              />
            </div>
            <div>
              <h3>Platform</h3>
              <Input
                name="videoId"
                label="YouTube Video ID or URL"
                type="text"
                // theme="dark"
                autoComplete="off"
                // onChange={(event) => setVideoId(event.target?.value?.trim?.())}
                // onChange={handleVideoInputChange}
              />

              {/* <div className="button" onClick={updatePreview}>
                Update Preview
              </div> */}

              <div>
                <h3>Preview</h3>
                {previewVideoId ? (
                  <YouTube
                    className={styles.youtubePreview}
                    videoId={previewVideoId}
                    opts={YouTubePlayerOptions}
                  />
                ) : (
                  <div className={styles.youtubePreview}></div>
                )}
              </div>
              {/* <div className="button" onClick={handleYTAuthClick}>
                Authenticate YouTube
              </div> */}
            </div>
            <div></div>
          </div>

          <button type="submit">Create Show</button>
        </Form>
        {/* )} */}
      </Formik>
    </div>
  );
}
