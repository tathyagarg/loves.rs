export default function Page() {
  return (
    <div class="relative top-24 flex flex-col items-center gap-4">
      <button
        onClick={() => {
          alert("hi");
        }}
      >
        hi
      </button>
    </div>
  )
}
