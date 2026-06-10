interface Props {
    children: React.ReactNode;
  }
  
  export default function PageContainer({
    children,
  }: Props) {
    return (
      <main
        className="
          min-h-screen
          px-4
          sm:px-5
          lg:px-6
          py-6
          lg:pb-6
        "
      >
        <div className="w-full max-w-7xl">
          {children}
        </div>
      </main>
    );
  }