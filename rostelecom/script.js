window.addEventListener('DOMContentLoaded', () => {

    const usersRow = document.querySelector('.users__row');

    // user data request function
    const userRequest = async (url) => {
        const data = await fetch(url);
        return await data.json();
    };

    // create user
    class User {
        constructor(id, name, username, email, phone, website) {
            this.id = id;
            this.name = name;
            this.username = username;
            this.email = email;
            this.phone = phone;
            this.website = website;
        }

        phoneNumber() {
            const i = this.phone.indexOf(' ');
            return this.phone.slice(0, i);
        }

        render() {
            const user = document.createElement('div');
            user.classList.add('users__column');
            user.innerHTML = `
                <div class="users__item">
                    <div class="users__name">
                        <h2>${this.id}. ${this.name}</h2>
                    </div>
                    <div class="users__username">
                        <h3>${this.username}</h3>
                    </div>
                    <div class="users__email link">
                        <a href="mailto:${this.email}">${this.email}</a>
                    </div>
                    <div class="users__phone link">
                        <a href="tel:+${this.phoneNumber()}">${this.phone}</a>
                    </div>
                    <div class="users__website link">
                        <a href="${this.website}" target="_blank" rel="noopener noreferrer">${this.website}</a>
                    </div>
                </div>
            `;
            usersRow.append(user);
        }
    }

    // displaying user data on the page
    userRequest('https://jsonplaceholder.typicode.com/users')
    .then(users => {
        users.forEach(({id, name, username, email, phone, website}) => {
            new User(id, name, username, email, phone, website).render();
        });
    })
    .catch(() => {
        const err = document.createElement('h1');
        err.classList.add('title');
        err.textContent = 'Произошла ошибка';
        err.style.padding = '0 0 0 20px';
        usersRow.append(err);
    });

    //* SEARCH=============================================================================
    const searchInput = document.querySelector('.search__input input');

    // hang the event handler on the input
    searchInput.addEventListener('input', e => {
        userRequest('https://jsonplaceholder.typicode.com/users')
        .then(users => {

            // hang an event handler on the input to find the user by name
            //! search by first name only
            const usersName = JSON.parse(JSON.stringify(users)).map(user => {
                user.name = user.name.toLowerCase().split(' ');
                return (user.name[0] === 'mrs.' || user.name[0] === 'mr.') ? user.name = user.name[1] : user.name = user.name[0];
            });

            // filter names by input value
            const filterNames = usersName.filter(name => name.match(e.target.value.toLowerCase()));

            const newUsers = [];

            // compare the names in the original array
            // and the array with the names found through the input
            // and put them into a newUsers
            filterNames.forEach(name => {
                users.forEach(user => {
                    if (user.name.toLowerCase().match(name)) {
                        newUsers.push(user);
                    }
                });
            });

            // clear the page from old data and place the found users
            usersRow.innerHTML = '';
            newUsers.forEach(({id, name, username, email, phone, website}) => {
                new User(id, name, username, email, phone, website).render();
            });
        })
        .catch(() => {
            const err = document.createElement('h1');
            err.classList.add('title');
            err.textContent = 'Произошла ошибка';
            err.style.padding = '0 0 0 20px';
            usersRow.append(err);
        });
    });
    //* SEARCH=============================================================================

    //* FILTERING==========================================================================
    const filterList = document.querySelector('#filter'),
          filterValue = filterList.querySelector('#filter p'),
          filterItems = filterList.querySelectorAll('#filter li');

    // expand the list of filters
    filterList.addEventListener('click', e => {
        if (e.target && e.target.tagName === 'P'){
            filterValue.classList.toggle('active');
        }
    });

    // insert the filter value into the select box
    const addValueOnFilter = (item) => {
        filterValue.innerHTML = `${item.innerHTML}`;
    };

    // sort by name
    const sortByName = (value) => {
        userRequest('https://jsonplaceholder.typicode.com/users')
        .then(users => {
            // clear the page from old data
            usersRow.innerHTML = '';

            // sort the array by the first name excluding 'Mrs' and 'Mr'
            users.sort((a, b) => {
                let aName = a.name.split(' ');
                let bName = b.name.split(' ');
                (aName[0] === 'Mrs.' || aName[0] === 'Mr.') ? aName = aName[1] : aName = aName[0];
                (bName[0] === 'Mrs.' || bName[0] === 'Mr.') ? bName = bName[1] : bName = bName[0];
                if (value === 'nameA') {
                    return (aName.toLowerCase() < bName.toLowerCase()) ? -1 : 1;
                }else if (value === 'nameZ') {
                    return (aName.toLowerCase() > bName.toLowerCase()) ? -1 : 1;
                }
                
            });
            
            users.forEach(({id, name, username, email, phone, website}) => {
                new User(id, name, username, email, phone, website).render();
            });
        })
        .catch(() => {
            const err = document.createElement('h1');
            err.classList.add('title');
            err.textContent = 'Произошла ошибка';
            err.style.padding = '0 0 0 20px';
            usersRow.append(err);
        });
    };

    // sort by default
    const sortDefault = () => {
        usersRow.innerHTML = '';
        userRequest('https://jsonplaceholder.typicode.com/users')
        .then(users => {
            users.forEach(({id, name, username, email, phone, website}) => {
                new User(id, name, username, email, phone, website).render();
            });
        })
        .catch(() => {
            const err = document.createElement('h1');
            err.classList.add('title');
            err.textContent = 'Произошла ошибка';
            err.style.padding = '0 0 0 20px';
            usersRow.append(err);
        });
    };

    // hang a handler for each filtering element
    filterItems.forEach(item => {
        item.addEventListener('click', () => {
            filterItems.forEach(item => {
                item.classList.remove('active');
            });
            item.classList.add('active');
            if (item.getAttribute('value') === 'nameA') {
                addValueOnFilter(item);
                sortByName(item.getAttribute('value'));
            }else if (item.getAttribute('value') === 'nameZ') {
                addValueOnFilter(item);
                sortByName(item.getAttribute('value'));
            }else if (item.getAttribute('value') === 'default') {
                addValueOnFilter(item);
                sortDefault();
            }
        });
    });
    //* FILTERING==========================================================================
});