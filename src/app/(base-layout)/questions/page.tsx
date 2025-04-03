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

interface Question {
  id: string;
  questionTitle: string;
  spurning: string;
  flokkur: {
    title: string;
  };
  authors: {
    name: string;
  }[];
}

const query = graphql(
  /* GraphQL */ `
    query Questions {
      allQuestions {
        questionTitle
        id
        spurning
        flokkur {
          title
        }
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
  // @ts-expect-error
  const { allQuestions } = await executeQuery<{ allQuestions: Question[] }, {}>(query, {});
  console.log(allQuestions);
  if (!allQuestions) {
    notFound();
  }
  return (
    <>
      <h3>Hér eru spurningar án svara:</h3>

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
