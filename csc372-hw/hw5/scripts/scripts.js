document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('gallery');
    const searchButton = document.getElementById('search');
    const usernameInput = document.getElementById('username');

    const fetchRepos = async (username) => {
        try {
            const response = await fetch(`https://api.github.com/users/${username}/repos`);
            const repos = await response.json();
            gallery.innerHTML = '';
            repos.forEach(async (repo) => {
                const commitsResponse = await fetch(repo.commits_url.replace('{/sha}', ''));
                const commits = await commitsResponse.json();
                const languagesResponse = await fetch(repo.languages_url);
                const languages = await languagesResponse.json();
                const repoElement = document.createElement('div');
                repoElement.classList.add('repo');
                repoElement.innerHTML = `
                    <h2><a href="${repo.html_url}" target="_blank">${repo.name}</a></h2>
                    <p>${repo.description || 'No description'}</p>
                    <p>Created: ${new Date(repo.created_at).toLocaleDateString()}</p>
                    <p>Updated: ${new Date(repo.updated_at).toLocaleDateString()}</p>
                    <p>Commits: ${commits.length}</p>
                    <p>Languages: ${Object.keys(languages).join(', ')}</p>
                    <p>Watchers: ${repo.watchers_count}</p>
                `;
                gallery.appendChild(repoElement);
            });
        } catch (error) {
            console.error('Error fetching repos:', error);
        }
    };

    searchButton.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        if (username) {
            fetchRepos(username);
        }
    });

    fetchRepos('SarvSrid');
    // SarvSrid
});