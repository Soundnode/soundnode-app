DESTDIR = /tmp

SNA_INSTALL_LOCATION = "$(DESTDIR)/opt/soundnodeapp/"

SNA_DIST_LOCATION = "dist/Soundnode-App/linux64"

verify_dist_exists:
	@if test ! -d $(SNA_DIST_LOCATION) ; then \
		echo "The distribution folder '$(SNA_DIST_LOCATION)' doesen't exist."; \
		echo "Did you forget to run 'grunt build'?"; \
		exit 1; \
	fi

install: verify_dist_exists
	mkdir -p $(SNA_INSTALL_LOCATION)

	cp --force --recursive --target-directory $(SNA_INSTALL_LOCATION) \
		$(SNA_DIST_LOCATION)/icudtl.dat \
		$(SNA_DIST_LOCATION)/libffmpegsumo.so \
		$(SNA_DIST_LOCATION)/locales/ \
		$(SNA_DIST_LOCATION)/nw.pak \
		$(SNA_DIST_LOCATION)/Soundnode-App

uninstall:
	rm -rf $(SNA_INSTALL_LOCATION)

clean:
	rm --force --recursive \
		debian/soundnodeapp \
		debian/files \
		debian/docs \
		debian/*.log \
		debian/*.substvars
