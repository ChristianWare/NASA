import {useRouter} from 'next/router'
import Image from 'next/image'
import Link from 'next/link'


export default function photo({photo}) {
  const router = useRouter();
  if(!router.isFallback && !photo) {
      return <div>EROOR 404 PAGE NOT FOUND</div>
  }
    return (
        <div>
            <div>
              {router.isFallback ? (
                  <div>LOADING...</div>
              ): (
                  <>
                  <Image width={960} priority height={540} src={photo} />
                  </>
              )}  
            </div>
            <div>
                <Link href='/'>
                  <a>
                      <button>GO HOME</button>
                  </a>
                </Link>
            </div>
        </div>
    );
}

export async function getStaticProps({ params }) {
  const nasa_id = params.id;
  const res = await fetch(`https://images-api.nasa.gov/asset/${nasa_id}`);
  const previews = await res.json();
  const photo = await previews.collection.items[0].href;

  return {
      props: {photo},
};
}


export async function getStaticPaths() {
    const res = await fetch('https://images-api.nasa.gov/search?media_type=image');
    const preview = await res.json();
    const items = await preview.collection.items;
    return {
        paths: 
        items?.map((nasa) => ({
            params: {
                id: nasa.data[0].nasa_id,
            },
        })) || [],
        fallback: true,
    }
}


