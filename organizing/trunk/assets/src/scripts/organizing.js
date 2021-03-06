(function($) {
  const Organizing = {
    _frame: null,

    _configs = {
      multiple: false,
      library: {
        type: 'image'
      }
    },

    _setupFrame: function() {
      if (null === this._frame) {
        this._frame = wp.media(this._configs);
      }
    },

    _bindEvents: function() {
      this._frame.on('open', $.proxy(this.onOpen, this));
      this._frame.state('library').on('select', $.proxy(this.onSelect, this));
      this.$root.on('click', '[data-organizing-upload-link]', $.proxy(this.open, this));
      this.$root.on('click', '[data-organizing-remove-link]', $.proxy(this.onRemove, this));
    },

    $root: null,

    $empty: null,

    $selected: null,

    $thumb: null,

    $input: null,

    start: function() {
      this.$root     = $('[data-organizing-upload]');
      this.$empty    = this.$root.find('[data-organizing-view-empty]');
      this.$selected = this.$root.find('[data-organizing-view-selected]');
      this.$thumb    = this.$root.find('[data-organizing-upload-image]');
      this.$input    = $('[data-organizing-image-input]');

      this._setupFrame();
      this._bindEvents();
    },

    open: function(event) {
      event.preventDefault();
      this._frame.open();
    },

    getFrameState: function() {
      return this._frame.state().get('selection');
    },

    onOpen: function() {
      const selection = this.getFrameState();
      const imageId   = this.$input.val().trim();
      const image     = wp.media.attachment(imageId);

      if (image) {
        selection.add(image);
      }
    },

    onSelect: function() {
      const imageModel = this.getFrameState().first();
      const imageId    = imageModel.get('id');
      const imageUrl   = imageModel.get('sizes').full.url;

      this.$input.val(imageId);
      this.$empty.addClass('hidden');
      this.$thumb.attr('src', imageUrl);
      this.$selected.removeClass('hidden');
    },

    onRemove: function(event) {
      event.preventDefault();

      this.$input.val('');
      this.$thumb.attr('src', '');
      this.$empty.removeClass('hidden');
      this.$selected.addClass('hidden');
    }
  };

  $(function() {
    Organizing.start();
  });
})(jQuery);
