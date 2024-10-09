export function LoadingSpinner() {
    return (
        <div className="flex justify-center">
            <div
                className="
            w-16
            h-16
            border-4
            border-t-primary
            border-b-primary
            border-r-transparent
            border-l-transparent
            rounded-full
            animate-spin
          "
            ></div>
        </div>
    );
}
