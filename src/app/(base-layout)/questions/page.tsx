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

export const metadata = {
  title: 'Ýmsar spurningar',
};
const query = graphql(
  /* GraphQL */ `
    query Questions {
      allQuestions {
        questionTitle
        id
        authors {
          name
        }
      }
    }
  `,
  [],
);

export default async function QuestionsPage() {
  revalidateTag('datocms');
  const { allQuestions } = await executeQuery(query, {});
  console.log(allQuestions);
  if (!allQuestions) {
    notFound();
  }
  return (
    <>
      <h3>Hér eru ósvaranlegar spurningar:</h3>

      <ul>
        {allQuestions.map((question) => (
          <li key={question.id}>
            <Link href={`/questions/${question.id}`}>{question.questionTitle}</Link>
          </li>
        ))}
      </ul>
      <Link href="/">Til baka</Link>
    </>
  );
}
