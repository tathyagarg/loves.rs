export function IconError(props: { class?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" color="currentColor" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;" > <path d="M12.884 2.532c-.346-.654-1.422-.654-1.768 0l-9 17A.999.999 0 0 0 3 21h18a.998.998 0 0 0 .883-1.467L12.884 2.532zM13 18h-2v-2h2v2zm-2-4V9h2l.001 5H11z"
      class={props.class}
    > </path></svg >
  )
}

export function IconTrash(props: { class?: string }) {
  return (
    <svg fill="currentColor" viewBox="0 0 16 16" color="currentColor" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;"
      class={props.class}
    ><path d="M14 2h-4c0-1.103-.897-2-2-2S6 .897 6 2H2a.5.5 0 0 0 0 1h.54l.809 9.708A2.513 2.513 0 0 0 5.84 15h4.319a2.514 2.514 0 0 0 2.491-2.292L13.459 3h.54a.5.5 0 0 0 0-1H14ZM8 1c.551 0 1 .449 1 1H7c0-.551.449-1 1-1Zm3.655 11.625A1.509 1.509 0 0 1 10.16 14H5.841a1.509 1.509 0 0 1-1.495-1.375L3.544 3h8.914l-.802 9.625h-.001ZM7 5.5v6a.5.5 0 0 1-1 0v-6a.5.5 0 0 1 1 0Zm3 0v6a.5.5 0 0 1-1 0v-6a.5.5 0 0 1 1 0Z"></path></svg>
  );
}

export function IconGithub(props: { class?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5"
      class={props.class}
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}
