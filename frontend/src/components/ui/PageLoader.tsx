export default function PageLoader() {
    return (
      <div className="py-8 animate-pulse">
  
        <div
          className="
          h-48
          rounded-3xl
          bg-slate-200
          mb-8
          "
        />
  
        <div
          className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-6
          "
        >
          {[1, 2, 3, 4].map(
            (item) => (
              <div
                key={item}
                className="
                bg-white
                rounded-2xl
                p-6
                shadow-sm
                border
                "
              >
                <div
                  className="
                  h-4
                  bg-slate-200
                  rounded
                  mb-4
                  "
                />
  
                <div
                  className="
                  h-8
                  bg-slate-200
                  rounded
                  w-2/3
                  "
                />
              </div>
            )
          )}
        </div>
  
      </div>
    );
  }