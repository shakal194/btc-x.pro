'use client'; // Директива для Client Component

export default function ScrollButton() {
  const handleClick = () => {
    document.getElementById('social')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <button
      className='mt-[30px] block w-full rounded-full border px-5 py-3 text-center text-primary font-bold leading-[110%] transition hover:border-[#FD6B06] hover:bg-[#FD6B06] hover:text-white focus:bg-[#FD6B06] focus:text-white'
      onClick={handleClick}
    >
      Стати частиною комʼюніті
    </button>
  );
}
