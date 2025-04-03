import { executeQuery } from '@/lib/datocms/executeQuery';
import { graphql } from '@/lib/datocms/graphql';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Key,
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
  AwaitedReactNode,
} from 'react';
import { revalidateTag } from 'next/cache';
import Markdown from 'react-markdown';

export const metadata = {
  title: 'Spurningakerfi',
};
const query = graphql(
  /* GraphQL */ `
    query Question($id: ItemId) {
      question(filter: { id: { eq: $id } }) {
        questionTitle
        flokkur {
          title
        }
        authors {
          name
          uppahaldsSpurningaflokkur {
            title
          }
        }
        spurning
      }
    }
  `,
  [],
);
interface Question {
  questionTitle: string;
  spurning: string;
}
export default async function QuestionsPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  revalidateTag('datocms');
  const { id } = await params;
  console.log(id);

  const { question } = (await executeQuery(query, { variables: { id } })) as { question: Question };
  if (!question) {
    notFound();
  }

  return (
    <>
      <h3>{question.questionTitle}</h3>
      <div>
        <Markdown>{question.spurning}</Markdown>
      </div>
      <Link href="/questions">Til baka</Link>
    </>
  );
}
