'use client';

import { Accordion, AccordionItem } from '@heroui/accordion';
import { useTranslations } from 'next-intl';

export default function AccordionFaq() {
  const t = useTranslations('mainPage.faq');

  const items = [
    {
      id: '1',
      question: t('question_1'),
      answer: t('answer_1'),
    },
    {
      id: '2',
      question: t('question_2'),
      answer: t('answer_2'),
    },
    {
      id: '3',
      question: t('question_3'),
      answer: t('answer_3'),
    },
    {
      id: '4',
      question: t('question_4'),
      answer: t('answer_4'),
    },
  ];

  return (
    <Accordion selectionMode='multiple'>
      {items.map((item) => {
        // Определяем заголовок и содержимое,
        // используя либо question/answer, либо title/content.
        const titleText = item.question || '';
        const contentText = item.answer || '';

        return (
          <AccordionItem
            key={item.id}
            title={titleText}
            textValue={titleText} // Передаём плоский текст для accessibility
            className='text-font18Leading130 tracking-tight lg:text-font30Leading130'
          >
            <p className='mt-2 text-primary leading-[120%] text-black/50'>
              {contentText}
            </p>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
