<svelte:head>
  <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet">
</svelte:head>

<script>

  import { FingerPrint, Check, X, Exclamation, Trash, ChartPie, Save, Upload} from 'svelte-hero-icons'
  import Icon from 'svelte-hero-icons/Icon.svelte'

	let listWords = ['noir','chose','tôt','si','écoute','rouge','carré','alors','jaune','mais','bleu','rouge','là','prends','jaune','carré','là','tout','alors','noir','rouge','bleu','rouge','prends','là','ca','blanc','alors','mets','rouge','carré','rouge','prends','rouge','jaune','là','vide','mets','noir','non','alors','bleu','carré','noir','alors','bien','noir','carré','chose','assez','jaune','bleu','mets','alors','rouge','vide','rouge','jaune','va','rouge','boîte','blanc','mets','bleu','mets','rouge','alors','rouge','chose','tôt','si','ici','rouge','alors','jaune','mais','là','ça','prends','rouge','noir','chose','tôt','si','écoute','rouge','carré','alors','jaune','mais','bleu','là','ça','prends','rouge','jaune','carré','là','tout','alors','rouge','bleu','prends','là','ça','blanc','alors','mets','rouge','carré','prends','jaune','là','rouge','mets','rouge','non','alors','bleu','carré','alors','bien','noir','carré','chose','assez','jaune','bleu','mets','alors','vide','noir','alors','jaune','va','alors','rouge','carré','noir','rouge','chose','boîte','blanc','mets','rouge','mets','rouge','alors','rouge','noir','si','ici','rouge','carré','alors','jaune','mais','là','rouge','prends','ça','noir','chose','tôt','si','écoute','rouge','carré','alors','jaune','mais','bleu','rouge','ça','prends','jaune','carré','là','tout','rouge',]

	let colorClasses = ["bleu", "jaune", "noir", "blanc"]
	let nbPerCol = 18
  let index = 0

  let nbCorrects = 0
  let nbErrors = 0
  let nbOmissions = 0
  let nbInhibitions = 0


	for (let i=0; i<listWords.length; i+=1){
		listWords[i] = {'text': listWords[i], 'id': i, 'commitment':false, 'inhibition':false, 'error':false, 'correct':false}
	}

	function updateIndexKeyboard(event){
		if (event.key === 'ArrowRight'){event.preventDefault(); index = Math.min(index+nbPerCol, listWords.length-1)}
		else if (event.key === 'ArrowLeft'){event.preventDefault();index = Math.max(0, index-nbPerCol)}
		else if (event.key === 'ArrowUp'){event.preventDefault();index = Math.max(0, index-1)}
		else if (event.key === 'ArrowDown'){event.preventDefault();index = Math.min(index+1, listWords.length-1)}
		else if (event.key === 'Backspace'){listWords[index].commitment=false, listWords[index].inhibition=false, listWords[index].error=false, listWords[index].correct=false}
		else if (event.key === 'Enter'){listWords[index].commitment=true}}

	function updateIndexMouse(event){
		index = Number(event.target.id)
	}

	function resetAll(event){
		for (let i=0; i<listWords.length; i+=1){
				listWords[i].correct = false
				listWords[i].inhibition = false
				listWords[i].error = false
				listWords[i].commitment = false
		}
    index=0
    this.blur() //deselect the button
	}

	function checkStates(listWords){

		for (let i=0; i<listWords.length; i+=1){
				listWords[i].correct = false
				listWords[i].inhibition = false
				listWords[i].error = false

				let iMinus1 = Math.max(0, i-1)
				let isRed = listWords[i].text == "rouge"
				let isCommit = listWords[i].commitment
				let isPastRed = listWords[iMinus1].text == "rouge"
				let isPastCommit = listWords[iMinus1].commitment
				let isColor = colorClasses.includes(listWords[i].text)
				let isPastColor = colorClasses.includes(listWords[iMinus1].text)

				if (isCommit && isRed) {listWords[i].correct=true}
				if (isCommit && isPastRed && !isPastCommit) {listWords[iMinus1].correct=true}
				if (isCommit && isPastRed && isPastCommit) {listWords[i].error=true}
				if (isCommit && !isRed && !isPastRed) {listWords[i].error=true}

				if (isCommit && isColor) {listWords[i].inhibition=true}
				if (isCommit && isPastColor) {listWords[iMinus1].inhibition=true}
		}
		return listWords
	}

  $: listWords = checkStates(listWords)

  let JSONFile
  let uploadButton
  async function readJSONFile(file) {
		let raw_text = await file.text()
    return JSON.parse(raw_text)
  }
  $: {JSONFile; if (JSONFile && JSONFile[0]){readJSONFile(JSONFile[0]).then((json) => listWords=json)}};

  const nbRed = listWords.filter(x => x.text=='rouge').length
  $: nbCorrects = listWords.filter(x => x.correct).length
  $: nbOmissions = nbRed - nbCorrects
  $: nbErrors = listWords.filter(x => x.error).length
  $: nbInhibitions = listWords.filter(x => x.inhibition).length


</script>

<svelte:window on:keydown={updateIndexKeyboard}/>

<div class="mt-5 ml-3">
  <button on:click={resetAll} type="button" class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-purple-600 bg-white hover:text-white hover:bg-purple-600">
    <Icon src="{Trash}" class="mr-1 w-6 h-6"/> Tout supprimer
  </button>

  <label>
    <div class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-purple-600 bg-white hover:text-white hover:bg-purple-600">
      <Icon src="{Upload}" class="mr-2 w-6 h-6"/> Choisir un fichier
    </div>
    <input type="file" class="hidden" bind:this={uploadButton} bind:files={JSONFile} accept="application/JSON" on:click={()=>uploadButton.value=''}>
  </label>

  <a href={'data:attachment/json,' + JSON.stringify(listWords)} target='_blank' download='color-tap.json' class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-purple-600 bg-white hover:text-white hover:bg-purple-600">
    <Icon src="{Save}" class="mr-2 w-6 h-6"/> Sauvegarder
  </a>
</div>



<div class="mt-5 ml-2 mr-2">
  <div class="grid grid-rows-18 gap-2 grid-flow-col">
    {#each listWords as word, i}
    <div>
      <div id={word.id} on:click={updateIndexMouse} class="justify-self-stretch pt-1 pb-1 pl-3 {word.id == index ? 'border-gray-500' : 'border-gray-200'} border self-stretch relative rounded-md shadow-sm">
        <p id={word.id} on:click={updateIndexMouse} class="font-medium block w-full pr-10 sm:text-sm rounded-md {word.text == 'rouge' ? 'text-red-900' : 'text-gray-600'}">
          {word.text}
        </p>
        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          {#if word.commitment}<Icon src="{FingerPrint}" class="mr-1 w-5 h-5 text-gray-600 z-0"/>{/if}
          {#if word.correct}<Icon src="{Check}" class="mr-1 w-5 h-5 text-green-600 z-0"/>{/if}
          {#if word.error}<Icon src="{X}" class="mr-1 w-5 h-5 text-red-600 z-0"/>{/if}
          {#if word.inhibition}<Icon src="{Exclamation}" class="mr-1 w-5 h-5 text-purple-600 z-0"/>{/if}
        </div>
      </div>
    </div>

    {/each}
  </div>
</div>

<div class="mt-5 ml-2 max-w-screen-md">
  <dl class="mt-5 grid gap-5 grid-cols-2">
    <div class="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
      <dt class="text-sm font-medium text-gray-500 truncate">
        Nombre de réponses correctes
      </dt>
      <dd class="mt-1 text-3xl font-semibold text-gray-900">
        {nbCorrects}

        <div class="inline-flex items-baseline px-2.5 py-0.5 md:mt-2 lg:mt-0">
          <Icon src="{Check}" class="w-6 h-6 text-green-600"/>
        </div>
      </dd>
    </div>

    <div class="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
      <dt class="text-sm font-medium text-gray-500 truncate">
        Nombre d'omissions
      </dt>
      <dd class="mt-1 text-3xl font-semibold text-gray-900">
        {nbOmissions}
      </dd>
    </div>

    <div class="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
      <dt class="text-sm font-medium text-gray-500 truncate">
        Nombre d'erreurs
      </dt>
      <dd class="mt-1 text-3xl font-semibold text-gray-900">
        {nbErrors}
        <div class="inline-flex items-baseline px-2.5 py-0.5 md:mt-2 lg:mt-0">
          <Icon src="{X}" class="w-6 h-6 text-red-600"/>
        </div>
      </dd>
    </div>

    <div class="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
      <dt class="text-sm font-medium text-gray-500 truncate">
        Nombre de problèmes d'inhibition
      </dt>
      <dd class="mt-1 text-3xl font-semibold text-gray-900">
        {nbInhibitions}
        <div class="inline-flex items-baseline px-2.5 py-0.5 md:mt-2 lg:mt-0">
          <Icon src="{Exclamation}" class="w-6 h-6 text-purple-600"/>
        </div>
      </dd>
    </div>
  </dl>
</div>
