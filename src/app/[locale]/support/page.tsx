'use client';

import { Form, Input, Button, Textarea } from '@heroui/react';
import { useState, useMemo } from 'react';
import Notiflix from 'notiflix';
import FullScreenSpinner from '@/components/ui/Spinner';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

export default function SupportPage() {
  const t = useTranslations('supportPage');
  const { locale } = useParams();

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (value: string) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);

  const isEmailInvalid = useMemo(() => {
    if (email === '') return true;
    return validateEmail(email) ? false : true;
  }, [email]);

  const isMessageInvalid = useMemo(() => {
    return message.length < 10;
  }, [message]);

  const onSubmit = async (e: any) => {
    e.preventDefault();

    if (!email) {
      setErrors({ email: t('form_error_email_empty') });
      return;
    }

    if (isEmailInvalid) {
      setErrors({ email: t('form_error_title') });
      return;
    }

    if (!message) {
      setErrors({ message: t('form_error_message_empty') });
      return;
    }

    if (isMessageInvalid) {
      setErrors({ message: t('form_error_message_short') });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/supportEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          message,
        }),
      });

      await response.json();

      if (response.ok) {
        Notiflix.Notify.success(`${t('form_success_message')}`);
        setEmail('');
        setMessage('');
      } else {
        Notiflix.Notify.failure(`${t('form_error_message')}`);
      }
    } catch (error) {
      Notiflix.Notify.failure(`${t('form_error_unknown')}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <section className='relative z-20 rounded-xl bg-[#F4F4F4] py-[30px] text-black lg:py-[100px]'>
        <div className='container mx-auto space-y-8 p-4'>
          {isSubmitting && <FullScreenSpinner />}
          <h2 className='p-4 text-font16Leading120 lg:text-font22Leading120'>
            {t('title')}
          </h2>
          <div className='mb-20'>
            <Form
              className='mx-auto w-full max-w-xs gap-3'
              validationErrors={errors}
              onSubmit={onSubmit}
            >
              <Input
                label='Email'
                labelPlacement='outside'
                color={isEmailInvalid ? 'danger' : 'success'}
                isInvalid={isEmailInvalid}
                name='email'
                placeholder={t('email_placeholder')}
                isRequired
                errorMessage={t('form_error_title')}
                type='email'
                value={email}
                variant='bordered'
                className='dark'
                onValueChange={setEmail}
                onClear={() => setEmail('')}
              />
              <Textarea
                label={t('message_label')}
                labelPlacement='outside'
                color={isMessageInvalid ? 'danger' : 'success'}
                isInvalid={isMessageInvalid}
                name='message'
                placeholder={t('message_placeholder')}
                isRequired
                errorMessage={t('form_error_message_short')}
                value={message}
                variant='bordered'
                minRows={3}
                maxRows={6}
                onValueChange={setMessage}
              />
              <Button
                type='submit'
                variant='solid'
                color={
                  isEmailInvalid || isMessageInvalid ? 'danger' : 'success'
                }
                isDisabled={isEmailInvalid || isMessageInvalid}
              >
                {t('button')}
              </Button>
            </Form>
          </div>
        </div>
      </section>
    </main>
  );
}
