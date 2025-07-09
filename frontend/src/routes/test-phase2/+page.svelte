<script lang="ts">
	let question = 'Who are you?';
	let response: any = null;
	let loading = false;
	let error: string | null = null;

	const testQuestions = [
		'Who are you?',
		'What technologies do you use?',
		'Do you work with React?',
		'How can I contact you?',
		'What kind of projects have you built?',
		'Are you available for new work?'
	];

	async function testChat() {
		if (!question.trim()) return;

		loading = true;
		error = null;
		response = null;

		try {
			const res = await fetch('/api/chat-test', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ question: question.trim() })
			});

			if (!res.ok) {
				throw new Error(`HTTP ${res.status}: ${res.statusText}`);
			}

			response = await res.json();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Unknown error';
			console.error('Chat test error:', err);
		} finally {
			loading = false;
		}
	}

	function setQuestion(q: string) {
		question = q;
		testChat();
	}
</script>

<svelte:head>
	<title>Chat System Test</title>
</svelte:head>

<div class="container">
	<h1>🤖 Q&A Chat System Test</h1>

	<div class="test-section">
		<h2>Quick Test Questions</h2>
		<div class="quick-questions">
			{#each testQuestions as testQ}
				<button class="test-btn" on:click={() => setQuestion(testQ)} disabled={loading}>
					{testQ}
				</button>
			{/each}
		</div>
	</div>

	<div class="input-section">
		<h2>Custom Question</h2>
		<div class="input-group">
			<input
				bind:value={question}
				placeholder="Ask a question..."
				disabled={loading}
				on:keydown={(e) => e.key === 'Enter' && testChat()}
			/>
			<button on:click={testChat} disabled={loading || !question.trim()}>
				{loading ? 'Testing...' : 'Test Chat'}
			</button>
		</div>
	</div>

	{#if loading}
		<div class="loading">
			<p>🤔 Processing your question...</p>
			<div class="spinner"></div>
		</div>
	{/if}

	{#if error}
		<div class="error">
			<h3>❌ Error</h3>
			<p>{error}</p>
		</div>
	{/if}

	{#if response}
		<div class="results">
			<h2>📋 Test Results</h2>

			<div class="section">
				<h3>🤔 Your Question</h3>
				<p class="question">"{response.question}"</p>
			</div>

			<div class="section">
				<h3>🔍 Similar Q&As Found ({response.similarQAs?.length || 0})</h3>
				{#if response.similarQAs?.length > 0}
					{#each response.similarQAs as qa, i}
						<div class="qa-match">
							<div class="qa-header">
								<strong>Match {i + 1}</strong>
								{#if qa.similarity}
									<span class="similarity">Similarity: {(qa.similarity * 100).toFixed(1)}%</span>
								{/if}
							</div>
							<div class="qa-content">
								<p><strong>Q:</strong> {qa.question}</p>
								<p><strong>A:</strong> {qa.answer}</p>
							</div>
						</div>
					{/each}
				{:else}
					<p>No similar Q&As found</p>
				{/if}
			</div>

			<div class="section">
				<h3>🤖 AI Response</h3>
				<div class="ai-response">
					{response.response}
				</div>
			</div>

			<div class="section debug">
				<h3>🔧 Debug Info</h3>
				<ul>
					<li>Embedding dimensions: {response.debug?.embeddingLength}</li>
					<li>Search results: {response.debug?.searchResults}</li>
					<li>Response length: {response.debug?.responseLength} characters</li>
				</ul>
			</div>
		</div>
	{/if}
</div>

<style>
	.container {
		max-width: 800px;
		margin: 2rem auto;
		padding: 2rem;
		font-family: system-ui, sans-serif;
		line-height: 1.6;
	}

	.test-section,
	.input-section {
		margin-bottom: 2rem;
		padding: 1.5rem;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		background: #f9f9f9;
	}

	h1,
	h2,
	h3 {
		margin-top: 0;
	}

	.quick-questions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.test-btn {
		padding: 0.5rem 1rem;
		border: 1px solid #ddd;
		border-radius: 6px;
		background: white;
		cursor: pointer;
		font-size: 0.875rem;
	}

	.test-btn:hover:not(:disabled) {
		background: #f0f0f0;
	}

	.test-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.input-group {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	input {
		flex: 1;
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 6px;
		font-size: 1rem;
	}

	button {
		padding: 0.75rem 1.5rem;
		background: #007bff;
		color: rgb(var(--fg-text-inverse));
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-size: 1rem;
	}

	button:hover:not(:disabled) {
		background: #0056b3;
	}

	button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.loading {
		text-align: center;
		padding: 2rem;
	}

	.spinner {
		width: 20px;
		height: 20px;
		border: 2px solid #f3f3f3;
		border-top: 2px solid #007bff;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin: 1rem auto;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.error {
		padding: 1rem;
		background: #f8d7da;
		border: 1px solid #f5c6cb;
		border-radius: 6px;
		color: #721c24;
	}

	.results {
		margin-top: 2rem;
	}

	.section {
		margin-bottom: 2rem;
		padding: 1.5rem;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		background: white;
	}

	.question {
		font-style: italic;
		padding: 1rem;
		background: #f8f9fa;
		border-left: 4px solid #007bff;
		margin: 0;
	}

	.qa-match {
		margin-bottom: 1rem;
		padding: 1rem;
		background: #f8f9fa;
		border-radius: 6px;
	}

	.qa-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.similarity {
		font-size: 0.875rem;
		color: #666;
		background: #e9ecef;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
	}

	.qa-content p {
		margin: 0.5rem 0;
		font-size: 0.875rem;
	}

	.ai-response {
		padding: 1rem;
		background: #e8f5e8;
		border-left: 4px solid #28a745;
		border-radius: 6px;
		white-space: pre-wrap;
	}

	.debug {
		background: #f8f9fa;
	}

	.debug ul {
		margin: 0;
		padding-left: 1.5rem;
	}

	.debug li {
		font-family: monospace;
		font-size: 0.875rem;
		color: #666;
	}
</style>
